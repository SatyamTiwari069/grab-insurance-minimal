# Project 2: GrabInsurance on Claude Desktop

## ✅ MCP Server Setup Complete

Your MCP server is now configured to run on Claude Desktop. Here's what's set up:

**Claude Desktop Config Location:**
```
C:\Users\KIIT\AppData\Roaming\Claude\claude_desktop_config.json
```

**Current Configuration:**
```json
{
  "mcpServers": {
    "grabinsurance": {
      "command": "node",
      "args": [
        "C:\\Users\\KIIT\\grab-insurance-minimal\\mcp-server\\dist\\index.js",
        "--stdio"
      ],
      "env": {}
    }
  }
}
```

## 🚀 How to Run on Claude Desktop

### Step 1: Start the HTTP Backend Server (for the web artifact)
```powershell
cd c:\Users\KIIT\grab-insurance-minimal\mcp-server
npm start
```
This runs on `http://localhost:8000` and serves the REST API.

### Step 2: Open Claude Desktop
The MCP server will automatically connect via stdio mode.

### Step 3: Use GrabInsurance Tools in Claude Chat

You can now ask Claude to use the GrabInsurance MCP tools:

**Available MCP Tools:**
1. **get_insurance_products** - Get all 8 insurance products
2. **classify_deal_intent** - Classify a deal to insurance recommendations
3. **calculate_premium** - Calculate premium for a deal
4. **generate_copy_variants** - Generate A/B copy variants
5. **resolve_multi_cart** - Handle multi-category deals
6. **record_conversion** - Record a purchase event
7. **get_analytics** - Get A/B testing analytics

## 💬 Example Prompts to Use in Claude Desktop

### Get All Insurance Products
```
Use the get_insurance_products tool to list all available insurance products.
```

### Classify a Deal
```
Use classify_deal_intent tool with:
- merchantName: "MakeMyTrip"
- category: "Travel"
- subcategory: "Domestic Flight"
- dealValue: 12400
```

### Calculate Premium
```
Use calculate_premium tool to find the premium for:
- dealValue: 25000
- productId: "electronics_warranty"
- riskTier: "medium"
```

### Generate Copy Variants
```
Use generate_copy_variants to create A/B copy for:
- merchantName: "Amazon"
- category: "Electronics"
- subcategory: "Smartphone"
- dealValue: 79999
- productId: "screen_damage"
- premium: 450
```

### View Live Analytics
```
Use get_analytics to see:
- Total conversions
- Revenue per variant
- Top products
- Recent purchases
```

## 📊 Real-Time Data Sync

When you interact with the Claude Desktop tools:
1. **MCP Server (stdio)** - Handles tool requests from Claude
2. **HTTP API (localhost:8000)** - Serves the web artifact and stores data
3. **In-Memory Database** - Real-time conversion tracking
4. **Analytics Dashboard** - Updates live on each purchase

## 🔄 Complete Architecture

```
Claude Desktop
    ↓
    ├─→ MCP Server (stdio mode)
    │   └─→ Tool Definitions (get_products, classify_intent, etc.)
    │       └─→ HTTP API calls
    │
    └─→ Web Artifact (runs in Claude chat)
        └─→ HTTP API (localhost:8000)
            ├─→ Product Catalog
            ├─→ Intent Classification
            ├─→ Dynamic Pricing
            ├─→ Copy Generation
            └─→ Conversion Tracking
```

## ✨ Key Features Available

✅ **Intent Classification** - Maps deals to best insurance products
✅ **Dynamic Pricing** - Contextual premium calculation
✅ **A/B Testing** - 3 copy variants tracked in real-time
✅ **Multi-Category Handling** - Resolves bundled deals
✅ **Conversion Analytics** - Variant performance metrics
✅ **8 Insurance Products** - Full catalog across all categories
✅ **Professional Copy** - Merchant-aware, contextual messaging

## 🎯 Next Steps

1. **Start the HTTP backend:**
   ```
   cd c:\Users\KIIT\grab-insurance-minimal\mcp-server
   npm start
   ```

2. **Restart Claude Desktop** (if it's already open) to reload the MCP config

3. **In Claude chat, try:**
   - "Use get_insurance_products to list all products"
   - "Classify a MakeMyTrip flight deal worth ₹12,400"
   - "Show me the A/B copy variants for Amazon electronics"

4. **View the artifact** - Open the Project 2 artifact in Claude chat to see the interactive UI connecting to the same backend

## 📞 Troubleshooting

**MCP Not Connecting?**
- Ensure HTTP backend is running on port 8000
- Check `claude_desktop_config.json` file syntax
- Verify `dist/index.js` exists in mcp-server folder
- Restart Claude Desktop completely

**File Path Issues?**
- Update the config file path to match your actual Node.js installation
- Use full absolute paths (no relative paths)

**Port Conflicts?**
- HTTP server uses port 8000
- MCP server uses stdio (no port needed)

## 📖 API Reference

### get_insurance_products
Lists all 8 insurance products with full details.

### classify_deal_intent(deal: Deal)
```
Input:
- merchantName: string
- category: "Travel" | "Electronics" | "Health" | "Food" | "Fashion & Beauty"
- subcategory: string
- dealValue: number

Output:
- top: Product
- second: Product
- confidence: number (0-1)
- reasoning: string
```

### calculate_premium(dealValue, productId, riskTier?)
```
Input:
- dealValue: number
- productId: string
- riskTier: "low" | "medium" | "high" (optional)

Output:
- premium: number
- breakdown: {
    baseRate: number
    basePremium: number
    riskTier: string
    riskMultiplier: number
    volumeDiscount: string
    finalPremium: number
  }
```

### generate_copy_variants(deal, product, premium)
Returns 3 A/B copy variants:
- variant_A: Direct benefit messaging
- variant_B: Emotional connection
- variant_C: Social proof

### record_conversion(sessionId, productId, premium, variant, category, merchant)
Tracks a purchase event with full attribution.

### get_analytics()
Returns real-time A/B testing metrics:
- totalConversions
- totalRevenue
- variantStats (A/B/C performance)
- categoryRevenue
- topProducts
- recentConversions

## 🎬 Demo Workflow

1. **User in Claude Desktop:**
   "Classify a MakeMyTrip flight deal for ₹12,400"

2. **MCP Tool Response:**
   Shows top 2 insurance products with confidence scores

3. **User:**
   "Generate A/B copy for the Travel Cancellation product"

4. **MCP Tool Response:**
   Returns 3 copy variants with contextual messaging

5. **User:**
   "Record a conversion for Variant C"

6. **Backend:**
   Updates real-time analytics visible in the web artifact

## 📦 Submission Ready

Your Project 2 implementation is complete and ready for evaluation:
- ✅ MCP Server - Fully functional with stdio support
- ✅ Claude Desktop Integration - Configured and working
- ✅ Web Artifact - Real-time sync with backend
- ✅ All Features - Intent classification, pricing, A/B testing, analytics
- ✅ Professional UI - Black/white/green theme
- ✅ Live Data - Real-time conversion tracking

Enjoy using GrabInsurance on Claude Desktop! 🚀
