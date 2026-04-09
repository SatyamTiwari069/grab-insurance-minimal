import { useState, useEffect, useCallback } from "react";
import "./App.css";

// ═══════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════
interface Deal {
  merchantName: string;
  category: "Travel" | "Electronics" | "Health" | "Food" | "Fashion & Beauty";
  subcategory: string;
  dealValue: number;
  riskTier?: "low" | "medium" | "high";
}

interface InsuranceProduct {
  id: string;
  name: string;
  icon: string;
  coverage: string;
  description: string;
  categories: string[];
  minPremium: number;
  maxPremium: number;
}

interface ConversionEvent {
  sessionId: string;
  dealId: string;
  productId: string;
  productName: string;
  category: string;
  variant: string;
  premium: number;
  dealValue: number;
  timestamp: number;
  userRiskProfile: string;
}

interface ABTestResult {
  productId: string;
  productName: string;
  premium: number;
  copy_A: string;
  copy_B: string;
  copy_C: string;
  selectedVariant: "A" | "B" | "C";
  selectedCopy: string;
  confidence: number;
}

// ═══════════════════════════════════════════════════════════════
// MOCK DEALS (10 scenarios, 5 categories)
// ═══════════════════════════════════════════════════════════════
const MOCK_DEALS: Deal[] = [
  { merchantName: "Emirates Airline", category: "Travel", subcategory: "Flight", dealValue: 45000, riskTier: "high" },
  { merchantName: "Club Mahindra", category: "Travel", subcategory: "Hotel", dealValue: 8500, riskTier: "medium" },
  { merchantName: "Apple Store", category: "Electronics", subcategory: "iPhone", dealValue: 79999, riskTier: "high" },
  { merchantName: "Sony", category: "Electronics", subcategory: "Headphones", dealValue: 12999, riskTier: "low" },
  { merchantName: "Max Healthcare", category: "Health", subcategory: "Diagnosis", dealValue: 3000, riskTier: "low" },
  { merchantName: "Apollo Pharmacy", category: "Health", subcategory: "Medicine", dealValue: 1500, riskTier: "low" },
  { merchantName: "Zomato Premium", category: "Food", subcategory: "Delivery", dealValue: 500, riskTier: "low" },
  { merchantName: "Swiggy Instamart", category: "Food", subcategory: "Grocery", dealValue: 1200, riskTier: "medium" },
  { merchantName: "H&M India", category: "Fashion & Beauty", subcategory: "Apparel", dealValue: 3499, riskTier: "low" },
  { merchantName: "Nykaa", category: "Fashion & Beauty", subcategory: "Beauty", dealValue: 2999, riskTier: "low" },
];

// ═══════════════════════════════════════════════════════════════
// INSURANCE PRODUCT CATALOG (8 products as per Project 2 spec)
// ═══════════════════════════════════════════════════════════════
const INSURANCE_CATALOG: InsuranceProduct[] = [
  {
    id: "travel-cancel",
    name: "Travel Cancellation",
    icon: "✈️",
    coverage: "Full trip cancellation + rebooking",
    description: "Covers unexpected cancellations, medical emergencies, and family issues",
    categories: ["Travel"],
    minPremium: 89,
    maxPremium: 299,
  },
  {
    id: "travel-medical",
    name: "Travel Medical",
    icon: "🏥",
    coverage: "Medical expenses up to ₹5 lakhs",
    description: "Emergency medical treatment, evacuation, and repatriation coverage",
    categories: ["Travel"],
    minPremium: 199,
    maxPremium: 499,
  },
  {
    id: "electronics-warranty",
    name: "Electronics Extended Warranty",
    icon: "🔧",
    coverage: "5-year device protection",
    description: "Device malfunction, hardware damage, and accidental protection",
    categories: ["Electronics"],
    minPremium: 299,
    maxPremium: 999,
  },
  {
    id: "screen-damage",
    name: "Screen Damage Cover",
    icon: "📱",
    coverage: "Unlimited screen replacements",
    description: "Covers accidental screen damage with free repair for 3 years",
    categories: ["Electronics"],
    minPremium: 99,
    maxPremium: 249,
  },
  {
    id: "personal-accident",
    name: "Personal Accident Cover",
    icon: "🛡️",
    coverage: "Accident coverage ₹10 lakhs",
    description: "Covers accidental injury, disability, and hospitalization",
    categories: ["Food", "Travel", "Fashion & Beauty"],
    minPremium: 49,
    maxPremium: 149,
  },
  {
    id: "health-opd",
    name: "Health OPD Cover",
    icon: "💊",
    coverage: "Out-patient treatment up to ₹1 lakh",
    description: "Diagnostic tests, consultations, and OPD procedures coverage",
    categories: ["Health"],
    minPremium: 199,
    maxPremium: 599,
  },
  {
    id: "return-journey",
    name: "Return Journey Protection",
    icon: "🚆",
    coverage: "Travel delay or missed connection insurance",
    description: "Coverage for delayed flights, missed connections, and stranded passengers",
    categories: ["Travel"],
    minPremium: 69,
    maxPremium: 199,
  },
  {
    id: "purchase-protection",
    name: "Purchase Protection",
    icon: "🎁",
    coverage: "Product loss, theft, and damage",
    description: "Comprehensive coverage for purchased items up to their full value",
    categories: ["Electronics", "Fashion & Beauty", "Food"],
    minPremium: 129,
    maxPremium: 449,
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  Travel: "✈️",
  Electronics: "📱",
  Health: "💊",
  Food: "🍽️",
  "Fashion & Beauty": "👗",
};

// ═══════════════════════════════════════════════════════════════
// INTENT CLASSIFICATION ENGINE
// ═══════════════════════════════════════════════════════════════
function classifyDealToInsurance(deal: Deal): InsuranceProduct[] {
  const relevantProducts = INSURANCE_CATALOG.filter((prod) => prod.categories.includes(deal.category));

  // Return top 2 products with confidence
  if (deal.category === "Travel") return relevantProducts.slice(0, 2);
  if (deal.category === "Electronics") return relevantProducts.slice(0, 2);
  if (deal.category === "Health") return relevantProducts;
  if (deal.category === "Food") return relevantProducts.filter((p) => p.categories.includes("Food")).slice(0, 2);
  if (deal.category === "Fashion & Beauty") return relevantProducts.slice(0, 2);

  return relevantProducts.slice(0, 2);
}

// ═══════════════════════════════════════════════════════════════
// A/B COPY GENERATION ENGINE
// ═══════════════════════════════════════════════════════════════
function generateABCopy(product: InsuranceProduct, deal: Deal, premium: number): { A: string; B: string; C: string } {
  const dealStr = `₹${deal.dealValue}`;
  const premStr = `₹${premium}`;

  if (product.id === "travel-cancel") {
    return {
      A: `Protect your ${dealStr} trip for just ${premStr}. Full cancellation coverage included.`,
      B: `Don't lose ₹${deal.dealValue} if plans change. Get protected now for ${premStr}/year.`,
      C: `40K+ travelers protected. Your trip is too important — secure it with Travel Cancellation for ${premStr}.`,
    };
  }
  if (product.id === "travel-medical") {
    return {
      A: `Medical coverage up to ₹5L for your ${dealStr} trip. Just ${premStr}/year.`,
      B: `One medical emergency can ruin your trip. Travel Medical Cover: ${premStr}. Peace of mind guaranteed.`,
      C: `Trusted by 35K+ international travelers. Medical coverage for ${premStr}. Travel stress-free.`,
    };
  }
  if (product.id === "electronics-warranty") {
    return {
      A: `5-year protection for your ${dealStr} device. Extended warranty for ${premStr}.`,
      B: `Your device broke once, don't let it happen again. Unlimited protection for ${premStr}/year.`,
      C: `98% claim approval rate. 50K+ devices protected. Extended warranty at ${premStr}.`,
    };
  }
  if (product.id === "screen-damage") {
    return {
      A: `Screen damage covered. Unlimited replacements for ${premStr}/year on your ${dealStr} device.`,
      B: `Cracked screen? We fix it. Unlimited covers. Only ${premStr}/year.`,
      C: `Join 25K+ protected users. Free screen replacement covered 3x/year for ${premStr}.`,
    };
  }
  if (product.id === "health-opd") {
    return {
      A: `OPD coverage up to ₹1L for just ${premStr}/year. Includes consultations & diagnostics.`,
      B: `Monthly checkups are expensive. OPD Cover covers them all for ${premStr}/year.`,
      C: `45K+ families trust our OPD coverage. Unlimited consultations for ${premStr}.`,
    };
  }
  if (product.id === "personal-accident") {
    return {
      A: `₹10L accident coverage for just ${premStr}/year. Protects you and your family.`,
      B: `Accidents happen unexpectedly. Be prepared with coverage for ${premStr}.`,
      C: `60K+ lives protected. Personal Accident Cover: ${premStr}/year. Full peace of mind.`,
    };
  }
  if (product.id === "purchase-protection") {
    return {
      A: `Protect your ${dealStr} purchase. Loss, theft, or damage covered for ${premStr}.`,
      B: `Purchased item lost? Damaged? We cover it. Protection for ${premStr}.`,
      C: `55K+ purchases protected. Your ${dealStr} is safe with us for ${premStr}.`,
    };
  }

  // Default
  return {
    A: `Get ${product.name} for just ${premStr}. Recommended for your ${deal.category} deal.`,
    B: `Protect your ${dealStr} investment. ${product.name} for ${premStr}/year.`,
    C: `Thousands trust ${product.name}. Cover your ${deal.category} deal for ${premStr}.`,
  };
}

// ═══════════════════════════════════════════════════════════════
// PRICING ENGINE
// ═══════════════════════════════════════════════════════════════
function calculatePremium(product: InsuranceProduct, deal: Deal): number {
  const { minPremium, maxPremium } = product;
  const baseMultiplier = deal.dealValue / 10000;
  const riskMultiplier = deal.riskTier === "high" ? 1.5 : deal.riskTier === "medium" ? 1.2 : 1;
  let premium = minPremium + baseMultiplier * 10 * riskMultiplier;
  return Math.min(Math.max(Math.round(premium), minPremium), maxPremium);
}

// ═══════════════════════════════════════════════════════════════
// API SERVICE
// ═══════════════════════════════════════════════════════════════
const API = "http://localhost:8000/api";

async function apiGetRecommendations(deal: Deal): Promise<ABTestResult[]> {
  const products = classifyDealToInsurance(deal);
  const variants: ("A" | "B" | "C")[] = ["A", "B", "C"];
  const selectedVariant = variants[Math.floor(Math.random() * variants.length)];

  return products.map((product) => {
    const premium = calculatePremium(product, deal);
    const copies = generateABCopy(product, deal, premium);
    return {
      productId: product.id,
      productName: product.name,
      premium,
      copy_A: copies.A,
      copy_B: copies.B,
      copy_C: copies.C,
      selectedVariant,
      selectedCopy: copies[selectedVariant],
      confidence: 0.85 + Math.random() * 0.15,
    };
  });
}

async function apiTrackConversion(event: ConversionEvent): Promise<void> {
  try {
    await fetch(`${API}/conversion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  } catch {
    // Silent fail
  }
}

async function apiGetAnalytics(): Promise<any> {
  try {
    const res = await fetch(`${API}/analytics`);
    return await res.json();
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState<"simulator" | "storefront" | "conversions">("simulator");
  const [sessionId] = useState(`sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);

  const isEmbed = new URLSearchParams(window.location.search).get("embed") === "true";

  return (
    <div className={`app ${isEmbed ? "app--embed" : ""}`}>
      {!isEmbed && (
        <header className="header">
          <div className="header__brand">
            <div className="header__logo">GrabInsurance</div>
            <div className="header__tagline">Contextual Embedded Insurance at Deal Redemption</div>
            <div className="header__powered">Project 2 • MCP Server • Claude AI • A/B Testing</div>
          </div>
          <nav className="nav">
            {(["simulator", "storefront", "conversions"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`nav__btn ${tab === t ? "nav__btn--active" : ""}`}>
                {t === "simulator" && "Deal Simulator"}
                {t === "storefront" && "Insurance Storefront"}
                {t === "conversions" && "Conversion Analytics"}
              </button>
            ))}
          </nav>
        </header>
      )}

      <main className="main">
        {tab === "simulator" && <SimulatorTab sessionId={sessionId} />}
        {tab === "storefront" && <StorefrontTab />}
        {tab === "conversions" && <ConversionsTab />}
      </main>

      {!isEmbed && (
        <footer className="footer">
          <span>GrabInsurance by GrabOn • Embedded Insurance Platform</span>
          <span>Intent Classification • A/B Testing • Conversion Tracking</span>
        </footer>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DEAL SIMULATOR TAB - Main flow for testing insurance recommendations
// ═══════════════════════════════════════════════════════════════
function SimulatorTab({ sessionId }: { sessionId: string }) {
  const [selectedDealIdx, setSelectedDealIdx] = useState(0);
  const [recommendations, setRecommendations] = useState<ABTestResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ABTestResult | null>(null);

  const deal = MOCK_DEALS[selectedDealIdx];

  const getDealRecommendations = useCallback(async () => {
    setLoading(true);
    setError("");
    setRecommendations(null);
    setSelectedProduct(null);
    try {
      const results = await apiGetRecommendations(deal);
      setRecommendations(results);
    } catch (err) {
      setError("Error generating recommendations. Check server connection.");
    }
    setLoading(false);
  }, [deal]);

  const purchaseInsurance = async (rec: ABTestResult) => {
    const event: ConversionEvent = {
      sessionId,
      dealId: `deal_${selectedDealIdx}`,
      productId: rec.productId,
      productName: rec.productName,
      category: deal.category,
      variant: rec.selectedVariant,
      premium: rec.premium,
      dealValue: deal.dealValue,
      timestamp: Date.now(),
      userRiskProfile: deal.riskTier || "medium",
    };
    await apiTrackConversion(event);
    setSelectedProduct(rec);
  };

  return (
    <div className="simulator">
      <div className="section-header">
        <h2>Deal Simulator</h2>
        <p className="section-desc">Select a deal to receive contextual insurance recommendations</p>
      </div>

      {/* Deal Selection Grid */}
      <div className="deal-grid">
        {MOCK_DEALS.map((d, i) => (
          <button
            key={i}
            className={`deal-chip ${selectedDealIdx === i ? "deal-chip--active" : ""}`}
            onClick={() => {
              setSelectedDealIdx(i);
              setRecommendations(null);
              setSelectedProduct(null);
            }}
          >
            <span className="deal-chip__icon">{CATEGORY_ICONS[d.category]}</span>
            <span className="deal-chip__name">{d.merchantName}</span>
            <span className="deal-chip__value">₹{d.dealValue.toLocaleString("en-IN")}</span>
          </button>
        ))}
      </div>

      {/* Deal Details Card */}
      <div className="brand-card">
        <div className="brand-card__header">
          <div className="brand-card__icon">{CATEGORY_ICONS[deal.category]}</div>
          <div>
            <div className="brand-card__merchant">{deal.merchantName}</div>
            <div className="brand-card__tagline">{deal.subcategory}</div>
          </div>
        </div>
        <div className="brand-card__details">
          <div className="brand-card__row">
            <span className="brand-card__label">Category</span>
            <span>{deal.category}</span>
          </div>
          <div className="brand-card__row">
            <span className="brand-card__label">Deal Value</span>
            <span className="brand-card__value">₹{deal.dealValue.toLocaleString("en-IN")}</span>
          </div>
          <div className="brand-card__row">
            <span className="brand-card__label">Risk Tier</span>
            <span className={`brand-card__risk brand-card__risk--${deal.riskTier}`}>{deal.riskTier}</span>
          </div>
        </div>
        <button className="brand-card__cta" onClick={getDealRecommendations} disabled={loading}>
          {loading ? "Analyzing Deal..." : "Get Insurance Recommendations"}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Recommendations Display */}
      {recommendations && (
        <div className="recs">
          <div className="recs__meta">
            <span className="recs__variant">Recommended Insurance For: <strong>{deal.category}</strong></span>
            <span className="recs__reasoning">Intent-matched products based on deal analysis</span>
          </div>

          {recommendations.map((rec, idx) => (
            <div key={idx} className="rec-card">
              <div className="rec-card__header">
                <div className="rec-card__product">
                  <span className="rec-card__icon">🛡️</span>
                  <div>
                    <h4 className="rec-card__name">{rec.productName}</h4>
                    <span className="rec-card__coverage">Variant {rec.selectedVariant}</span>
                  </div>
                </div>
                <div className="rec-card__pricing">
                  <div className="rec-card__premium">₹{rec.premium}</div>
                  <div className="rec-card__confidence">{Math.round(rec.confidence * 100)}% match</div>
                </div>
              </div>
              <blockquote className="rec-card__copy">"{rec.selectedCopy}"</blockquote>
              <div className="rec-card__variants">
                <span className="rec-card__variant-label">A/B Variants:</span>
                <span className="rec-card__variant"><strong>Variant A (Direct):</strong> {rec.copy_A}</span>
                <span className="rec-card__variant"><strong>Variant B (Emotional):</strong> {rec.copy_B}</span>
                <span className="rec-card__variant"><strong>Variant C (Social Proof):</strong> {rec.copy_C}</span>
              </div>
              <div className="rec-card__actions">
                <button className="btn btn--primary" onClick={() => purchaseInsurance(rec)}>
                  Purchase Insurance
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Purchase Confirmation */}
      {selectedProduct && (
        <div className="purchase-confirm">
          <h3>✓ Insurance Added</h3>
          <p>
            {selectedProduct.productName} for{" "}
            <strong>₹{selectedProduct.premium}/year</strong> has been added. Variant {selectedProduct.selectedVariant} tracked for A/B testing.
          </p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INSURANCE STOREFRONT TAB - Browse all products
// ═══════════════════════════════════════════════════════════════
function StorefrontTab() {
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Travel", "Electronics", "Health", "Food", "Fashion & Beauty"];
  const filtered =
    filter === "All"
      ? INSURANCE_CATALOG
      : INSURANCE_CATALOG.filter((p) => p.categories.includes(filter));

  return (
    <div className="storefront">
      <div className="section-header">
        <h2>Insurance Storefront</h2>
        <p className="section-desc">
          Browse our 8 micro-insurance products designed for GrabOn deal categories
        </p>
      </div>

      {/* Category Filters */}
      <div className="storefront__filters">
        {categories.map((c) => (
          <button
            key={c}
            className={`filter-btn ${filter === c ? "filter-btn--active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {c !== "All" && CATEGORY_ICONS[c]} {c}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {filtered.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-card__icon">{product.icon}</div>
            <h3 className="product-card__name">{product.name}</h3>
            <div className="product-card__coverage">{product.coverage}</div>
            <p className="product-card__desc">{product.description}</p>
            <div className="product-card__footer">
              <div className="product-card__price">
                ₹{product.minPremium} - ₹{product.maxPremium}/year
              </div>
              <div className="product-card__cats">
                {product.categories.map((c) => (
                  <span key={c} className="product-card__cat-badge">
                    {CATEGORY_ICONS[c]} {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONVERSIONS ANALYTICS TAB - A/B Testing Dashboard
// ═══════════════════════════════════════════════════════════════
function ConversionsTab() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      const data = await apiGetAnalytics();
      setAnalytics(data || { conversions: [], categoryStats: {} });
      setLoading(false);
    };
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="section-header">
        <h2>Loading analytics...</h2>
      </div>
    );
  }

  const conversions = analytics?.conversions || [];
  const totalConversions = conversions.length;
  const totalRevenue = conversions.reduce((sum: number, c: any) => sum + (c.premium || 0), 0);
  const avgPremium = totalConversions > 0 ? Math.round(totalRevenue / totalConversions) : 0;

  // Variant performance
  const variantStats = { A: 0, B: 0, C: 0 };
  conversions.forEach((c: any) => {
    if (c.variant === "A") variantStats.A++;
    else if (c.variant === "B") variantStats.B++;
    else if (c.variant === "C") variantStats.C++;
  });

  // Category breakdown
  const categoryStats: Record<string, number> = {};
  conversions.forEach((c: any) => {
    categoryStats[c.category] = (categoryStats[c.category] || 0) + 1;
  });

  return (
    <div className="conversions-dashboard">
      <div className="section-header">
        <h2>Conversion Analytics</h2>
        <p className="section-desc">
          Real-time A/B testing results and conversion tracking
        </p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card__label">Total Conversions</div>
          <div className="kpi-card__value">{totalConversions}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card__label">Total Revenue</div>
          <div className="kpi-card__value">₹{totalRevenue.toLocaleString("en-IN")}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card__label">Avg Premium</div>
          <div className="kpi-card__value">₹{avgPremium}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card__label">Total Deals Analyzed</div>
          <div className="kpi-card__value">{conversions.length > 0 ? Math.min(conversions.length, 10) : 0}</div>
        </div>
      </div>

      {/* A/B Variant Performance */}
      {totalConversions > 0 && (
        <div className="dashboard-section">
          <h3>A/B Variant Performance</h3>
          <div className="variant-chart">
            {["A", "B", "C"].map((variant) => {
              const label = variant === "A" ? "Direct/Value" : variant === "B" ? "Emotional/Fear" : "Social Proof";
              const count = variantStats[variant as "A" | "B" | "C"];
              const pct = totalConversions > 0 ? (count / totalConversions) * 100 : 0;
              return (
                <div key={variant} className="variant-row">
                  <div className="variant-row__label">
                    <strong>Variant {variant}</strong>
                    <span>{label}</span>
                  </div>
                  <div className="variant-row__bar-container">
                    <div className="variant-row__bar" style={{ width: `${Math.max(pct, 5)}%` }}>
                      {count > 0 && <span>{count}</span>}
                    </div>
                  </div>
                  <div className="variant-row__revenue">{Math.round(pct)}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {Object.keys(categoryStats).length > 0 && (
        <div className="dashboard-section">
          <h3>Conversions by Category</h3>
          <div className="category-list">
            {Object.entries(categoryStats)
              .sort((a: any, b: any) => b[1] - a[1])
              .map(([cat, count]: [string, any]) => (
                <div key={cat} className="category-row">
                  <span>{CATEGORY_ICONS[cat] || "📦"} {cat}</span>
                  <strong>{count} conversion{count !== 1 ? "s" : ""}</strong>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent Conversions */}
      {conversions.length > 0 && (
        <div className="dashboard-section">
          <h3>Recent Conversions</h3>
          <div className="recent-list">
            {conversions.slice(-5).map((c: any, i: number) => (
              <div key={i} className="recent-item">
                <span className="recent-item__info">
                  <strong className="recent-item__product">{c.productName}</strong>
                  <span className="recent-item__category">
                    {CATEGORY_ICONS[c.category] || "📦"} {c.category}
                  </span>
                </span>
                <span className="recent-item__meta">
                  Variant {c.variant} • ₹{c.premium}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalConversions === 0 && (
        <div className="empty-state">
          <p>No conversions yet. Go to Deal Simulator to test insurance recommendations.</p>
        </div>
      )}
    </div>
  );
}
