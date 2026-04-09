# GrabInsurance Setup & Deployment Guide

## ✅ What's Included

This is a **production-ready** insurance recommendation engine with:

- **MCP Server** (for Claude Desktop AI) - No API key needed ✨
- **HTTP API** (for React frontend) - Standalone, no dependencies on external APIs
- **React Frontend** - Polished, embedding-ready insurance storefront UI
- **A/B Testing Framework** - Session-sticky variant tracking with analytics
- **8 Insurance Products** - Travel, Electronics, Health, Food, Fashion & Beauty
- **Contextual Copy Generator** - 3 variants per offer (Direct, Emotional, Social Proof)
- **Dynamic Pricing** - Risk-adjusted premiums with volume discounts
- **Multi-Cart Resolution** - Handles multiple categories in one session
- **Partner Brand Database** - 10 merchants with brand colors, icons, taglines
- **Analytics Dashboard** - Real-time conversion tracking

---

## 🚀 Quick Start (2 Minutes)

### 1. Build the Project

```bash
# Install all dependencies
cd c:\Users\KIIT\grab-insurance-minimal
npm run install:all

# Build both mcp-server and frontend
npm run build:all
```

### 2. Run MCP Server (for Claude Desktop)

```bash
cd mcp-server
npm start -- --stdio
```

This server **requires NO API keys** and uses the MCP protocol for Claude Desktop integration.

### 3. Run HTTP Server + Frontend (separate terminal)

```bash
cd mcp-server
npm start
# Server runs on http://localhost:8000

# In another terminal:
cd frontend
npm run dev
# Frontend on http://localhost:5173
```

---

## 📋 Setup for Claude Desktop

### Step 1: Build MCP Server

```bash
cd c:\Users\KIIT\grab-insurance-minimal\mcp-server
npm run build
```

### Step 2: Find Claude Desktop Config Location

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Mac:**
```
~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

### Step 3: Update Claude Desktop Config

Edit the config file and add:

```json
{
  "mcpServers": {
    "grabinsurance": {
      "command": "node",
      "args": ["C:\\Users\\KIIT\\grab-insurance-minimal\\mcp-server\\dist\\index.js", "--stdio"],
      "env": {}
    }
  }
}
```

**Important:** Use absolute paths (replace `C:\\Users\\KIIT\\` with your actual path).

### Step 4: Restart Claude Desktop

Close and reopen Claude Desktop. The GrabInsurance MCP server will now be available.

---

## 🎯 Available MCP Tools (in Claude Desktop)

Once configured, you'll have access to these tools in Claude:

### 1. **classify_deal**
```
Input: merchant, category, subcategory, deal value, risk tier
Output: Top 2 insurance products with confidence scores, pricing, copy variants
```

### 2. **get_premium_quote**
```
Input: product ID, deal value, risk tier
Output: Dynamic premium with breakdown (base, risk multiplier, volume discount)
```

### 3. **generate_offer_copy**
```
Input: merchant, category, deal value, product ID, premium
Output: 3 A/B copy variants (Direct/Emotional/SocialProof)
```

### 4. **list_insurance_products**
```
Input: Optional category filter
Output: All 8 insurance products with descriptions and pricing
```

### 5. **resolve_multi_cart**
```
Input: Array of deals (multi-category)
Output: Prioritized insurance recommendations per category
```

### 6. **get_brand_info**
```
Input: Merchant name
Output: Brand color, icon, tagline, domain
```

### 7. **track_conversion**
```
Input: Session ID, product ID, premium, variant, deal info
Output: Confirmation with conversion ID
```

### 8. **get_analytics**
```
Input: None
Output: A/B stats, revenue by variant/category, top products
```

### 9. **run_test_scenarios**
```
Input: None
Output: Classification results for all 10 mock deals
```

---

## 🌐 HTTP API Endpoints (for Frontend)

The server runs on `http://localhost:8000`

### Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | Get all 8 insurance products |
| GET | `/api/brands` | Get all 10 partner brands |
| GET | `/api/deals` | Get 10 mock deal scenarios |
| POST | `/api/recommend` | Get insurance recommendations for a deal |
| POST | `/api/conversion` | Track a successful conversion |
| GET | `/api/analytics` | Get A/B testing analytics |
| POST | `/api/cart/add` | Add insurance to cart |
| GET | `/api/cart/:sessionId` | Get cart contents |
| DELETE | `/api/cart/:sessionId/:index` | Remove cart item |
| POST | `/api/multi-cart/resolve` | Resolve multi-category deals |

### Example: Get Recommendation

```bash
curl -X POST http://localhost:8000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "deal": {
      "merchantName": "Emirates Airline",
      "category": "Travel",
      "subcategory": "Flight",
      "dealValue": 45000,
      "riskTier": "high"
    },
    "sessionId": "user123"
  }'
```

---

## 🎨 Frontend Features

**URL:** `http://localhost:5173`

### 1. **Deal Simulator**
- Dropdown to select from 10 mock deals
- Auto-fetches insurance recommendations
- Shows merchant branding (color, icon, tagline)

### 2. **Insurance Storefront**
- Displays top 2 recommended products
- Shows dynamic premium pricing
- Shows 3 A/B copy variants
- "Add to Cart" buttons
- Shows confidence scores

### 3. **Shopping Cart**
- Multi-category cart (Travel + Electronics)
- Cart item removal
- Total premium calculation
- Category breakdown

### 4. **A/B Analytics Dashboard**
- Real-time KPIs (Sessions, Conversions, Revenue)
- Variant performance comparison (bar chart)
- Revenue by category
- Top products by conversions
- Recent conversion feed

---

## 📊 Insurance Product Catalog

### Travel (2 products)
1. **Travel Cancellation Cover** - ₹89+, Full refund
2. **Travel Medical Insurance** - ₹49+, ₹5L coverage

### Electronics (3 products)
3. **Extended Warranty** - ₹199+, 2 extra years
4. **Screen Damage Protection** - ₹149+, Unlimited repairs
5. **Purchase Protection Plan** - ₹99+, Price drop + damage

### Health (1 product)
6. **Health OPD Cover** - ₹199+, ₹2L/year

### Food (1 product)
7. **Personal Accident Cover** - ₹29+, ₹50L protection

### Fashion & Beauty (1 product)
8. **Return & Refund Protection** - ₹79+, Full refund in 30 days

---

## 🔧 Architecture

```
GrabInsurance
├── mcp-server/
│   ├── src/index.ts (combined HTTP + stdio MCP server)
│   ├── dist/ (compiled JS)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx (main React component)
│   │   ├── App.css (polished styling)
│   │   └── main.tsx
│   ├── dist/ (built production files)
│   └── package.json
├── claude_desktop_config.json (MCP configuration)
└── package.json (root)
```

### How It Works

1. **Frontend** → Calls HTTP API on `/api/recommend`
2. **HTTP API** (in mcp-server) → Classifies deal, calculates premium, generates copy
3. **MCP Server** (same binary) → Provides same tools to Claude Desktop via stdio
4. **Analytics** → Tracks conversions in-memory for A/B testing

---

## 🧪 Test Scenarios

The project includes **10 mock deals across 5 categories** for testing:

1. **Emirates Airline** (Travel/Flight) - ₹45,000
2. **Club Mahindra** (Travel/Hotel) - ₹8,500
3. **Apple Store** (Electronics/iPhone) - ₹79,999
4. **Sony** (Electronics/Headphones) - ₹12,999
5. **Max Healthcare** (Health/Diagnosis) - ₹3,000
6. **Apollo Pharmacy** (Health/Medicine) - ₹1,500
7. **Zomato Premium** (Food/Delivery) - ₹500
8. **Swiggy Instamart** (Food/Grocery) - ₹1,200
9. **H&M India** (Fashion & Beauty/Apparel) - ₹3,499
10. **Nykaa** (Fashion & Beauty/Beauty) - ₹2,999

### Run Test Scenarios

**Via Claude Desktop:**
Use the `run_test_scenarios` tool to see classification results for all 10 deals.

**Via HTTP:**
```bash
curl http://localhost:8000/api/deals
```

---

## 🚨 Edge Cases Handled

✅ **Ambiguous Categories** - Falls back to default products with confidence score  
✅ **Bundle Deals** - Multi-category cart resolution (shows top product per category)  
✅ **High-Value Deals** - Volume discount applied (>20K: 5%, >50K: 8%)  
✅ **Returning Users** - User history bonus to confidence  
✅ **Risk Tiers** - Premiums adjusted (low: 0.8x, high: 1.25x)  
✅ **Missing Subcategories** - Uses category-level defaults  
✅ **Unknown Merchants** - Falls back to generic branding  

---

## 🔐 Security & Privacy

- **No API Keys Required** ✅
- **No External APIs** ✅
- **All Processing Local** ✅
- **In-Memory Data** (clears on restart)
- **CORS Enabled** for frontend

---

## 📝 Customization

### Add New Insurance Product

Edit `mcp-server/src/index.ts` - `INSURANCE_CATALOG`:

```typescript
{
  id: "my_product",
  name: "My Insurance Product",
  shortName: "My Product",
  coverage: "₹1,00,000",
  basePremiumRate: 0.012,
  minPremium: 149,
  categories: ["Travel", "Food"],
  icon: "🎁",
  description: "...",
  subcategoryBoost: ["Flight", "Delivery"],
}
```

### Add New Partner Brand

Edit `BRANDS` object:

```typescript
"My Merchant": { 
  color: "#FF0000", 
  icon: "🏪", 
  tagline: "Great products", 
  domain: "mymerchant.com" 
}
```

### Customize Copy

Edit `generateCopy()` function in `mcp-server/src/index.ts`.

---

## 🐛 Troubleshooting

### MCP Server Not Appearing in Claude Desktop
- Verify config file syntax (valid JSON)
- Check file path is absolute
- Restart Claude Desktop completely
- Check `mcp-server/dist/index.js` exists (ran build?)

### Frontend Can't Connect to API
- Verify HTTP server running: `http://localhost:8000/api/health`
- Check frontend API URL in `App.tsx` (line ~100): `const API = "http://localhost:8000/api"`
- Browser console for CORS errors

### TypeScript Errors on Build
- Delete node_modules: `rm -r mcp-server/node_modules frontend/node_modules`
- Reinstall: `npm run install:all`
- Rebuild: `npm run build:all`

### Port 8000 Already in Use
- Change in `mcp-server/src/index.ts` (line ~950): `const PORT = parseInt(process.env.PORT || "8000");`
- Or: `PORT=3000 npm start`

---

## 📦 Production Deployment

### Deploy as HTTP API
```bash
npm run build:mcp
npm start  # Or: PORT=8000 npm start
```

### Deploy as Docker Container
```dockerfile
FROM node:18
WORKDIR /app
COPY mcp-server /app
RUN npm install && npm run build
CMD ["npm", "start"]
```

### Deploy MCP Server
```bash
npm run build:mcp
# Copy dist/index.js to production server
# Configure Claude Desktop with correct path
```

---

## 📞 Support

For issues or improvements:
1. Check TypeScript compilation: `npm run build:all`
2. Verify mock data loads: `curl http://localhost:8000/api/health`
3. Test MCP tools in Claude Desktop with `run_test_scenarios`
4. Check browser console for frontend errors

---

**Happy insurance selling! 🎉**
