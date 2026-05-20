# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Build the React frontend
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS frontend-builder

WORKDIR /build

# Install frontend dependencies
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline

# Copy source and build
COPY index.html vite.config.js eslint.config.js ./
COPY public ./public
COPY src ./src

RUN npm run build
# Output: /build/dist

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Install backend production dependencies
# No native modules — pure JS only, no build tools needed
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS backend-builder

WORKDIR /build/backend

COPY backend/package.json backend/package-lock.json* ./
RUN npm ci --omit=dev --prefer-offline

# ─────────────────────────────────────────────────────────────────────────────
# Stage 3 — Final runtime image
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy backend source
COPY backend/server.js   ./
COPY backend/db.js       ./
COPY backend/routes      ./routes/

# Copy backend node_modules from builder
COPY --from=backend-builder /build/backend/node_modules ./node_modules/

# Copy the compiled React frontend
COPY --from=frontend-builder /build/dist ./dist/

# Create the data directory and set ownership
RUN mkdir -p /app/data && chown -R appuser:appgroup /app

USER appuser

# Expose the application port
EXPOSE 3001

# Environment defaults (override at runtime)
ENV NODE_ENV=production \
    PORT=3001 \
    DATA_DIR=/app/data \
    RESET_PASSWORD=RCB

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

CMD ["node", "--no-warnings=ExperimentalWarning", "server.js"]
