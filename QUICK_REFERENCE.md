# ⚡ GrabInsurance - Quick Reference

**TL;DR:** Everything works. No API keys needed. Start in 2 minutes.

---

## 🏃 5-Minute Setup

### 1. Build
```bash
cd c:\Users\KIIT\grab-insurance-minimal
npm run install:all && npm run build:all
```

### 2. Terminal 1: Backend
```bash
cd mcp-server && npm start
# Opens http://localhost:8000
```

### 3. Terminal 2: Frontend
```bash
cd frontend && npm run dev
# Opens http://localhost:5173
```

**Done!** Try selecting "Emirates Airline" deal from the dropdown.

---

## 📚 Documentation Map

| Need | Go To |
|------|-------|
| Complete setup | [SETUP.md](./SETUP.md) |
| What's included | [PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md) |
| Status checklist | [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) |
| Claude Desktop | [SETUP.md#-setup-for-claude-desktop](./SETUP.md#-setup-for-claude-desktop) |
| API reference | [SETUP.md#-http-api-endpoints](./SETUP.md#-http-api-endpoints) |
| Troubleshooting | [SETUP.md#-troubleshooting](./SETUP.md#-troubleshooting) |
| Original scope | [SCOPE.md](./SCOPE.md) |

---

## 🎯 What's Working

✅ 8 Insurance Products  
✅ 10 Test Deals (5 categories)  
✅ Smart Classification (92 rules)  
✅ Dynamic Pricing  
✅ A/B Testing (3 variants)  
✅ Cart & Checkout  
✅ Analytics Dashboard  
✅ Claude Desktop MCP  
✅ No API keys needed  
✅ All builds & compiles  

---

## 🔧 Available Commands

```bash
# Root directory
npm run install:all    # Install deps for mcp-server + frontend
npm run build:all      # Build both projects
npm run dev:mcp        # Dev mode for backend only
npm run dev:frontend   # Dev mode for frontend only
npm run build:mcp      # Build backend only
npm run build:frontend # Build frontend only

# mcp-server/
npm start              # HTTP server on port 8000
npm start -- --stdio   # MCP mode for Claude Desktop
npm run dev            # Watch mode

# frontend/
npm run dev            # Vite dev server (port 5173)
npm run build          # Production build
npm run preview        # Preview production build
```

---

## 🚀 Where Everything Is

```
Backend: mcp-server/dist/index.js (1,083 lines)
  - Express HTTP API (11 endpoints)
  - MCP stdio protocol (9 tools)
  - All classification, pricing, copy logic
  - In-memory database

Frontend: frontend/dist/ (compiled React app)
  - Simulator tab (select deals, see recommendations)
  - Cart tab (multi-category shopping)
  - Analytics tab (A/B metrics, revenue)
  - All styling and interactive features

Docs:
  - SETUP.md (300+ lines, complete guide)
  - PROJECT_COMPLETE.md (full status)
  - README.md (overview + quick start)
  - DEPLOYMENT_CHECKLIST.md (what's done)
  - QUICK_REFERENCE.md (you are here)

Config:
  - claude_desktop_config.json (MCP setup)
  - .env.example (environment template)
  - package.json (root scripts)
```

---

## 🧪 Test It Out

### Via Frontend
1. Open http://localhost:5173
2. Simulator tab → Select "Emirates Airline"
3. See 2 insurance recommendations + 3 copy variants
4. Click "Add to Cart"
5. Go to Cart tab
6. Go to Analytics tab → See conversion tracked

### Via Claude Desktop
See [SETUP.md#-setup-for-claude-desktop](./SETUP.md#-setup-for-claude-desktop)

### Via API (curl)
```bash
curl http://localhost:8000/api/health

curl http://localhost:8000/api/products

curl -X POST http://localhost:8000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"deal":{"merchantName":"Emirates Airline","category":"Travel","subcategory":"Flight","dealValue":45000,"riskTier":"high"},"sessionId":"test"}'
```

---

## 📋 Insurance Products at a Glance

| ID | Product | Min | Categories |
|----|---------|-----|------------|
| 1 | Travel Cancellation | ₹89 | Travel |
| 2 | Travel Medical | ₹49 | Travel |
| 3 | Extended Warranty | ₹199 | Electronics |
| 4 | Screen Protection | ₹149 | Electronics |
| 5 | Purchase Protection | ₹99 | Electronics, Fashion |
| 6 | Health OPD | ₹199 | Health |
| 7 | Personal Accident | ₹29 | Food, Health |
| 8 | Return Protection | ₹79 | Fashion & Beauty |

---

## 🎯 Test Deals (Try Below)

| Name | Category | Value |
|------|----------|-------|
| Emirates Airline | Travel | ₹45,000 |
| Club Mahindra | Travel | ₹8,500 |
| Apple Store | Electronics | ₹79,999 |
| Sony | Electronics | ₹12,999 |
| Max Healthcare | Health | ₹3,000 |
| Apollo Pharmacy | Health | ₹1,500 |
| Zomato Premium | Food | ₹500 |
| Swiggy Instamart | Food | ₹1,200 |
| H&M India | Fashion | ₹3,499 |
| Nykaa | Beauty | ₹2,999 |

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 8000 in use | Kill node: `Get-Process node \| Stop-Process -Force` |
| Frontend won't load | Check backend is running: `curl http://localhost:8000/api/health` |
| Build errors | Delete node_modules: `rm -r mcp-server/node_modules frontend/node_modules` then reinstall |
| Claude Desktop won't show tools | Restart Claude completely, check config path is absolute |

See [SETUP.md#-troubleshooting](./SETUP.md#-troubleshooting) for more.

---

## ✨ Key Features

**One-Click Classification**
- Input: merchant, category, subcategory, deal value
- Output: Top 2 products with confidence scores

**Dynamic Pricing**
- Risk adjustment (low/medium/high)
- Volume discounts (5-8% off)
- Automatic minimum enforcement

**Contextual Copy**
- 3 A/B variants per product
- Merchant-aware personalization
- Session-sticky testing

**Multi-Category Cart**
- Travel + Electronics in same session
- Per-category recommendations
- Conflict resolution via priority

**Real-Time Analytics**
- Conversion tracking
- Variant performance metrics
- Revenue by category/product

---

## 🔐 Security Notes

- ✅ No API keys anywhere
- ✅ No external API calls
- ✅ All data in-memory (clears on restart)
- ✅ CORS enabled for embedding
- ✅ TypeScript type-safe

---

## 📦 File Sizes

| Item | Size |
|------|------|
| Frontend JS | 160 KB (50 KB gzipped) |
| Frontend CSS | 18.5 KB (~4 KB gzipped) |
| MCP Backend | ~150 KB compiled |
| Total Source | ~2,500 lines code |

---

## 🎓 Architecture (30-Second Version)

```
Frontend (React)
    ↓ HTTP /api/recommend
Backend (Express)
    ├─ HTTP server (for frontend)
    └─ MCP stdio (for Claude Desktop)
    
Backend knows:
    - 8 insurance products
    - 92 classification rules
    - Dynamic pricing logic
    - Copy generation templates
    - Analytics tracking
```

---

## 🚀 Next Steps

1. **Just browsing?** → Read [PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md)
2. **Want to run it?** → Follow section 1 above or [SETUP.md](./SETUP.md)
3. **Using Claude Desktop?** → [SETUP.md#-setup-for-claude-desktop](./SETUP.md#-setup-for-claude-desktop)
4. **Need to customize?** → [SETUP.md#-customization](./SETUP.md#-customization)
5. **Deploying?** → [SETUP.md#-production-deployment](./SETUP.md#-production-deployment)

---

## 📞 Support

- Detailed guide: [SETUP.md](./SETUP.md)
- Full status: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- Project info: [PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md)
- Original scope: [SCOPE.md](./SCOPE.md)

---

**✅ Project is COMPLETE and READY TO USE!**

All code is built, tested, and documented. No further work needed.

Start with step 1 above or jump to [SETUP.md](./SETUP.md) for detailed instructions.
