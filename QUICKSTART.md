# Quick Start Guide ⚡

Get GrabInsurance (MCP + Frontend) running in **3 minutes**!

## Step 1: Get Claude API Key (1 min)

1. Go to **https://console.anthropic.com**
2. Login to your account
3. Click **API Keys** → **Create new key**
4. Copy your key (starts with `sk-ant-`)

## Step 2: Configure (30 seconds)

Edit `.env` file:
```env
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE
PORT=8000
```

## Step 3: Install Dependencies (1 min)

```bash
# From root directory
npm install
```

Or manually:
```bash
cd mcp-server && npm install && cd ../frontend && npm install && cd ..
```

## Step 4: Start MCP Server (Terminal 1) ⚙️

```bash
cd mcp-server
npm run dev
```

**Wait for this message:**
```
🚀 GrabInsurance MCP+HTTP Server on http://localhost:8000
✅ Claude AI: Ready
📊 HTTP Endpoints: /recommend, /conversion, /analytics, /cart/*, /products
```

## Step 5: Start Frontend (Terminal 2) 🎨

```bash
cd frontend
npm run dev
```

**Wait for this message:**
```
  VITE v4.3.9  ready in X ms
  ➜  Local:   http://localhost:5173/
```

## Step 6: Open Browser 🌐

Visit **http://localhost:5173**

## Test the Flow

1. **Simulator Tab**
   - Select "Emirates Airline" deal (₹45,000)
   - Click "Get Recommendations from MCP"
   - See top 2 insurance products with AI copy
   - Click "Add to Cart"

2. **Cart Tab**
   - See added items
   - View total premium
   - Click "Proceed to Checkout"

3. **Analytics Tab**
   - See conversion tracked
   - View A/B variant distribution
   - Check revenue metrics

**Try all 10 scenarios!** (Different merchants, categories, values)

## What's Running

| Service | Port | Purpose |
|---------|------|---------|
| **MCP Server** | 8000 | Backend (Classification, Pricing, Claude, Tracking) |
| **Frontend** | 5173 | React UI (Simulator, Cart, Analytics) |

## Troubleshooting

**MCP Server crashes on startup?**
```bash
# Check if port 8000 is already in use
netstat -ano | findstr :8000

# If used, free it:
taskkill /PID <PID> /F

# Or use different port:
PORT=3001 npm run dev
```

**Frontend shows blank page?**
```bash
# Make sure you're visiting correct URL
http://localhost:5173  ✓ Correct
http://localhost:8000  ✗ Wrong (that's MCP Server)

# Check browser console (F12) for errors
```

**"Cannot GET /recommend" error?**
```bash
# MCP Server not running or not on port 8000
# Check Terminal 1 is showing:
# 🚀 GrabInsurance MCP+HTTP Server on http://localhost:8000

# If it's on different port, edit frontend/src/App.tsx:
# const MCP_SERVER_URL = 'http://localhost:YOUR_PORT'
```

**Claude API errors?**
```bash
# Check .env file
# Correct:  ANTHROPIC_API_KEY=sk-ant-...
# Wrong:    ANTHROPIC_API_KEY="sk-ant-..."  (has quotes!)
# Also verify the API key is valid
```

## Production Build

```bash
# Build both simultaneously
npm run build:all

# Or manually:
cd mcp-server && npm run build
cd ../frontend && npm run build
```

Outputs:
- `mcp-server/dist/index.js` - Backend
- `frontend/dist/` - Frontend static files

## MCP Server Modes

**HTTP Mode** (what we're using):
```bash
npm run dev
# Serves REST API for frontend on http://localhost:8000
```

**Claude Desktop Mode**:
```bash
npm run mcp
# Runs on stdio for Claude Desktop integration
# Add to Claude config: { "grabinsurance": { "command": "node dist/index.js --stdio" } }
```

## Test All 10 Deals

Automatically available in dropdown:

✈️ **Travel:**
- Emirates Airline (₹45,000) - High risk
- Club Mahindra (₹8,500) - Medium risk

📱 **Electronics:**
- Apple Store (₹79,999) - High risk
- Sony (₹12,999) - Low risk

🏥 **Health:**
- Max Healthcare (₹3,000) - Low risk
- Apollo Pharmacy (₹1,500) - Low risk

🍕 **Food:**
- Zomato Premium (₹500) - Low risk
- Swiggy Instamart (₹1,200) - Medium risk

👗 **Fashion & Beauty:**
- H&M India (₹3,499) - Low risk
- Nykaa (₹2,999) - Low risk

## Pro Tips 💡

1. **Open DevTools** (F12) to see API calls and responses
2. **Try different variants** - Each session randomly gets A/B variant
3. **Analytics update live** - Add items and watch metrics change
4. **Mobile test** - Open DevTools, toggle device toolbar (Ctrl+Shift+M)
5. **Copy is AI-generated** - Fresh personalization per deal from Claude

## What's Happening Behind the Scenes

```
You click "Get Recommendations"
        ↓
Frontend sends deal to MCP Server (/recommend)
        ↓
MCP Server classifies deal (Travel → Travel Insurance)
        ↓
MCP Server calculates premiums (₹45000 × 0.7% × 1.2 = ₹378)
        ↓
MCP Server calls Claude AI for personalized copy
        ↓
Claude returns: "Emirates ₹45000? Travel insurance for ₹378"
        ↓
MCP Server sends back: { recommendations: [...], variant: "A", ... }
        ↓
Frontend displays top 2 products with copy
        ↓
You click "Add to Cart"
        ↓
Conversion tracked to analytics (variant_A, ₹378, Travel)
        ↓
Analytics tab shows new conversion in real-time
```

## Time Estimate

| Step | Duration |
|------|----------|
| Get API key | 1 min |
| Configure .env | 30 sec |
| npm install | 1 min |
| MCP Server startup | 20 sec |
| Frontend startup | 20 sec |
| First test | 1 min |
| **Total** | ~4 min |

---

**That's it! You're ready to test GrabInsurance.** 🛡️

For full documentation: see **README.md**

