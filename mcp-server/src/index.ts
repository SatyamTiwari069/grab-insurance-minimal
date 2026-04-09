#!/usr/bin/env node
import express, { Request, Response } from "express";
import cors from "cors";
import { createInterface } from "readline";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════
interface Deal {
  merchantName: string;
  category: "Travel" | "Electronics" | "Health" | "Food" | "Fashion & Beauty";
  subcategory: string;
  dealValue: number;
  riskTier?: "low" | "medium" | "high";
  userHistory?: string[];
}

interface InsuranceProduct {
  id: string;
  name: string;
  shortName: string;
  coverage: string;
  coverageAmount: string;
  basePremiumRate: number;
  minPremium: number;
  categories: string[];
  icon: string;
  description: string;
  subcategoryBoost: string[];
}

interface CopyVariants {
  variant_A: string;
  variant_B: string;
  variant_C: string;
}

// ═══════════════════════════════════════════════════════════════
// INSURANCE PRODUCT CATALOG (8 Products)
// ═══════════════════════════════════════════════════════════════
const INSURANCE_CATALOG: InsuranceProduct[] = [
  {
    id: "travel_cancel",
    name: "Travel Cancellation Cover",
    shortName: "Trip Cancel",
    coverage: "Up to ₹1,00,000",
    coverageAmount: "₹1L",
    basePremiumRate: 0.007,
    minPremium: 89,
    categories: ["Travel"],
    icon: "🛫",
    description:
      "Full refund if your trip gets cancelled due to emergencies, illness, or visa rejection. Covers flights, hotels, and packages.",
    subcategoryBoost: ["Flight", "International", "Cruise", "Package"],
  },
  {
    id: "travel_medical",
    name: "Travel Medical Insurance",
    shortName: "Travel Health",
    coverage: "Up to ₹5,00,000",
    coverageAmount: "₹5L",
    basePremiumRate: 0.005,
    minPremium: 49,
    categories: ["Travel"],
    icon: "🏥",
    description:
      "Covers medical emergencies, hospital stays, and evacuation during travel. Includes COVID-19 cover.",
    subcategoryBoost: ["Hotel", "International", "Adventure", "Cruise"],
  },
  {
    id: "electronics_warranty",
    name: "Extended Warranty",
    shortName: "Ext Warranty",
    coverage: "2 extra years",
    coverageAmount: "2 Years",
    basePremiumRate: 0.025,
    minPremium: 199,
    categories: ["Electronics"],
    icon: "🔧",
    description:
      "Extends manufacturer warranty by 2 years. Covers hardware defects, malfunctions, and electrical surges.",
    subcategoryBoost: ["Phone", "iPhone", "Laptop", "TV", "Smartphone"],
  },
  {
    id: "screen_damage",
    name: "Screen Damage Protection",
    shortName: "Screen Shield",
    coverage: "Unlimited repairs/year",
    coverageAmount: "Unlimited",
    basePremiumRate: 0.015,
    minPremium: 149,
    categories: ["Electronics"],
    icon: "📱",
    description:
      "Unlimited screen repairs for accidental drops and cracks. Zero deductible, doorstep service.",
    subcategoryBoost: ["Phone", "iPhone", "Tablet", "Smartphone"],
  },
  {
    id: "personal_accident",
    name: "Personal Accident Cover",
    shortName: "Accident Cover",
    coverage: "Up to ₹50,00,000",
    coverageAmount: "₹50L",
    basePremiumRate: 0.003,
    minPremium: 29,
    categories: ["Food", "Health"],
    icon: "🛡️",
    description:
      "24/7 accident coverage. Hospitalization, disability, and accidental death benefit included.",
    subcategoryBoost: ["Delivery", "Outdoor", "Gym", "Sports"],
  },
  {
    id: "health_opd",
    name: "Health OPD Cover",
    shortName: "OPD Cover",
    coverage: "Up to ₹2,00,000/year",
    coverageAmount: "₹2L/yr",
    basePremiumRate: 0.008,
    minPremium: 199,
    categories: ["Health"],
    icon: "💊",
    description:
      "Covers doctor consultations, diagnostics, medicine, and OPD treatments. No waiting period.",
    subcategoryBoost: ["Diagnosis", "Medicine", "Pharmacy", "Consultation"],
  },
  {
    id: "return_protection",
    name: "Return & Refund Protection",
    shortName: "Easy Return",
    coverage: "Full refund guarantee",
    coverageAmount: "100%",
    basePremiumRate: 0.006,
    minPremium: 79,
    categories: ["Fashion & Beauty"],
    icon: "↩️",
    description:
      "Full refund within 30 days, no questions asked. Includes free pickup and return shipping.",
    subcategoryBoost: ["Apparel", "Shoes", "Clothing", "Dress"],
  },
  {
    id: "purchase_protection",
    name: "Purchase Protection Plan",
    shortName: "Buy Safe",
    coverage: "Price drop + damage",
    coverageAmount: "Full",
    basePremiumRate: 0.01,
    minPremium: 99,
    categories: ["Electronics", "Fashion & Beauty"],
    icon: "🔒",
    description:
      "Covers price drops within 30 days and accidental damage from day one. Instant claims.",
    subcategoryBoost: ["Headphones", "Accessories", "Beauty", "Premium", "Cosmetics"],
  },
];

// ═══════════════════════════════════════════════════════════════
// PARTNER BRAND DATABASE
// ═══════════════════════════════════════════════════════════════
const BRANDS: Record<string, { color: string; icon: string; tagline: string; domain: string }> = {
  "Emirates Airline": { color: "#D71921", icon: "✈️", tagline: "Fly Better", domain: "emirates.com" },
  "Club Mahindra": { color: "#2E7D32", icon: "🏨", tagline: "Holiday Every Year", domain: "clubmahindra.com" },
  "Apple Store": { color: "#555555", icon: "🍎", tagline: "Think Different", domain: "apple.com/in" },
  Sony: { color: "#000080", icon: "🎧", tagline: "Be Moved", domain: "sony.co.in" },
  "Max Healthcare": { color: "#C62828", icon: "🏥", tagline: "Caring for Life", domain: "maxhealthcare.in" },
  "Apollo Pharmacy": { color: "#1565C0", icon: "💊", tagline: "Good Health for All", domain: "apollopharmacy.in" },
  "Zomato Premium": { color: "#E23744", icon: "🍽️", tagline: "Better food for more people", domain: "zomato.com" },
  "Swiggy Instamart": { color: "#FC8019", icon: "🛒", tagline: "What is in your mind?", domain: "swiggy.com" },
  "H&M India": { color: "#E50010", icon: "👗", tagline: "Fashion & Quality at Best Price", domain: "hm.com/in" },
  Nykaa: { color: "#FC2779", icon: "💄", tagline: "Unlock Your Beauty", domain: "nykaa.com" },
};

// ═══════════════════════════════════════════════════════════════
// INTENT CLASSIFICATION ENGINE
// Subcategory-aware with edge case handling
// ═══════════════════════════════════════════════════════════════
const SUBCATEGORY_RULES: Record<string, Record<string, string[]>> = {
  Travel: {
    Flight: ["travel_cancel", "travel_medical"],
    International: ["travel_medical", "travel_cancel"],
    Hotel: ["travel_medical", "travel_cancel"],
    Bus: ["travel_cancel", "personal_accident"],
    Train: ["travel_cancel", "personal_accident"],
    Cruise: ["travel_cancel", "travel_medical"],
    Adventure: ["travel_medical", "personal_accident"],
    Package: ["travel_cancel", "travel_medical"],
    default: ["travel_cancel", "travel_medical"],
  },
  Electronics: {
    Phone: ["screen_damage", "electronics_warranty"],
    iPhone: ["screen_damage", "electronics_warranty"],
    Smartphone: ["screen_damage", "electronics_warranty"],
    Tablet: ["screen_damage", "electronics_warranty"],
    Laptop: ["electronics_warranty", "purchase_protection"],
    TV: ["electronics_warranty", "purchase_protection"],
    Headphones: ["purchase_protection", "electronics_warranty"],
    Accessories: ["purchase_protection", "electronics_warranty"],
    Camera: ["electronics_warranty", "purchase_protection"],
    default: ["electronics_warranty", "screen_damage"],
  },
  Health: {
    Diagnosis: ["health_opd", "personal_accident"],
    Medicine: ["health_opd", "personal_accident"],
    Pharmacy: ["health_opd", "personal_accident"],
    Consultation: ["health_opd", "personal_accident"],
    Gym: ["personal_accident", "health_opd"],
    Wellness: ["health_opd", "personal_accident"],
    default: ["health_opd", "personal_accident"],
  },
  Food: {
    Delivery: ["personal_accident", "health_opd"],
    Grocery: ["personal_accident", "purchase_protection"],
    Dining: ["personal_accident", "health_opd"],
    default: ["personal_accident", "health_opd"],
  },
  "Fashion & Beauty": {
    Apparel: ["return_protection", "purchase_protection"],
    Shoes: ["return_protection", "purchase_protection"],
    Clothing: ["return_protection", "purchase_protection"],
    Dress: ["return_protection", "purchase_protection"],
    Beauty: ["purchase_protection", "return_protection"],
    Cosmetics: ["purchase_protection", "return_protection"],
    Premium: ["purchase_protection", "return_protection"],
    default: ["return_protection", "purchase_protection"],
  },
};

function classifyIntent(deal: Deal) {
  const rules = SUBCATEGORY_RULES[deal.category] || {};

  // Find matching subcategory rule (case-insensitive)
  const subcatKey = Object.keys(rules).find(
    (k) => k !== "default" && deal.subcategory.toLowerCase().includes(k.toLowerCase())
  );

  const productIds = subcatKey ? rules[subcatKey] : rules.default || ["health_opd", "personal_accident"];

  const top = INSURANCE_CATALOG.find((p) => p.id === productIds[0])!;
  const second = INSURANCE_CATALOG.find((p) => p.id === productIds[1])!;

  // Confidence scoring
  let confidence = 0.62;
  if (subcatKey) confidence += 0.15; // Subcategory match bonus
  if (deal.dealValue > 10000) confidence += 0.05; // High-value deal bonus
  if (deal.dealValue > 50000) confidence += 0.03; // Very high-value bonus
  if (deal.userHistory && deal.userHistory.length > 0) confidence += 0.08; // Returning user
  if (top.subcategoryBoost.some((s) => deal.subcategory.toLowerCase().includes(s.toLowerCase()))) {
    confidence += 0.05; // Strong product-subcategory affinity
  }
  confidence = Math.min(confidence, 0.98);

  const isAmbiguous = !subcatKey;
  const isBundleOpportunity = deal.dealValue > 20000;

  const reasoning = subcatKey
    ? `${deal.category}/${deal.subcategory} matched rule "${subcatKey}" → ${top.name} (${Math.round(confidence * 100)}% confidence)`
    : `${deal.category} (no specific subcategory match for "${deal.subcategory}") → ${top.name} (${Math.round(confidence * 100)}% confidence)`;

  return {
    top,
    second,
    confidence: Math.round(confidence * 100) / 100,
    secondConfidence: Math.round(Math.max(0.3, confidence - 0.18) * 100) / 100,
    reasoning,
    isAmbiguous,
    isBundleOpportunity,
  };
}

// ═══════════════════════════════════════════════════════════════
// DYNAMIC PRICING ENGINE
// Risk-adjusted with volume discounts
// ═══════════════════════════════════════════════════════════════
function calculatePremium(dealValue: number, product: InsuranceProduct, riskTier = "medium") {
  const riskMultipliers: Record<string, number> = { low: 0.8, medium: 1.0, high: 1.25 };
  const riskMultiplier = riskMultipliers[riskTier] || 1.0;

  // Volume discount for high-value deals
  let volumeDiscount = 1.0;
  if (dealValue > 50000) volumeDiscount = 0.92;
  else if (dealValue > 20000) volumeDiscount = 0.95;

  const raw = dealValue * product.basePremiumRate * riskMultiplier * volumeDiscount;
  const premium = Math.max(product.minPremium, Math.round(raw));

  return {
    premium,
    breakdown: {
      baseRate: product.basePremiumRate,
      basePremium: Math.round(dealValue * product.basePremiumRate),
      riskTier,
      riskMultiplier,
      volumeDiscount: volumeDiscount < 1 ? `${Math.round((1 - volumeDiscount) * 100)}% off` : "none",
      minPremium: product.minPremium,
      finalPremium: premium,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// CONTEXTUAL COPY GENERATOR
// Hyper-personalized, merchant-aware insurance copy
// 3 A/B variants: Direct (A), Emotional (B), Social proof (C)
// ═══════════════════════════════════════════════════════════════
function formatValue(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${Math.round(value / 1000)}K`;
  return `₹${value}`;
}

function generateCopy(deal: Deal, product: InsuranceProduct, premium: number): CopyVariants {
  const fv = formatValue(deal.dealValue);
  const fp = `₹${premium}`;
  const merchant = deal.merchantName;
  const shortMerchant = merchant.split(" ")[0];

  const copyMap: Record<string, CopyVariants> = {
    travel_cancel: {
      variant_A: `Your ${fv} ${shortMerchant} trip. Cancel worry-free for just ${fp}.`,
      variant_B: `Plans change. Don't lose ${fv} on ${shortMerchant}. Protect for ${fp}.`,
      variant_C: `9 out of 10 ${shortMerchant} travellers add cancellation cover. Just ${fp}.`,
    },
    travel_medical: {
      variant_A: `${shortMerchant} trip + ₹5L medical cover. Just ${fp}.`,
      variant_B: `A hospital visit abroad costs ₹3L+. Cover your ${shortMerchant} trip for ${fp}.`,
      variant_C: `Smart travellers never skip medical cover. ${fp} for your ${fv} trip.`,
    },
    electronics_warranty: {
      variant_A: `Your ${fv} ${shortMerchant} purchase. 2 extra years warranty for ${fp}.`,
      variant_B: `Repairs after warranty cost more than ${fp}. Extend your ${shortMerchant} cover.`,
      variant_C: `Most ${shortMerchant} buyers extend warranty. ${fp} for 2 extra years.`,
    },
    screen_damage: {
      variant_A: `Cracked ${shortMerchant} screen? Zero-cost repairs, just ${fp}/year.`,
      variant_B: `One drop = ${fv} gone. Unlimited screen repairs for ${fp}.`,
      variant_C: `${shortMerchant} users love this: unlimited screen repairs at ${fp}.`,
    },
    personal_accident: {
      variant_A: `₹50L accident cover with your ${shortMerchant} order. Just ${fp}.`,
      variant_B: `Accidents don't wait. ₹50L protection for your family at ${fp}.`,
      variant_C: `${shortMerchant} customers add accident cover. ${fp} for ₹50L protection.`,
    },
    health_opd: {
      variant_A: `Doctor visits covered. ₹2L/year OPD with your ${shortMerchant} purchase, ${fp}.`,
      variant_B: `OPD bills add up fast. Cover unlimited doctor visits for ${fp}.`,
      variant_C: `${shortMerchant} health shoppers save with OPD cover at ${fp}.`,
    },
    return_protection: {
      variant_A: `Wrong size from ${shortMerchant}? Full refund in 30 days for ${fp}.`,
      variant_B: `Don't risk ${fv}. Free returns on your ${shortMerchant} order for ${fp}.`,
      variant_C: `${shortMerchant} shoppers return worry-free. Just ${fp} for full protection.`,
    },
    purchase_protection: {
      variant_A: `${shortMerchant} price drops next week? We cover the diff. ${fp}.`,
      variant_B: `${fv} purchase + ${fp} protection = zero buyer's remorse.`,
      variant_C: `${shortMerchant} buyers protect against price drops & damage. Just ${fp}.`,
    },
  };

  return (
    copyMap[product.id] || {
      variant_A: `Protect your ${fv} ${shortMerchant} purchase for ${fp}.`,
      variant_B: `${fv} at risk. Secure it for just ${fp}.`,
      variant_C: `${shortMerchant} + insurance. Smart move at ${fp}.`,
    }
  );
}

// ═══════════════════════════════════════════════════════════════
// MULTI-CATEGORY CART RESOLVER
// Handles: Myntra + MakeMyTrip in same session
// ═══════════════════════════════════════════════════════════════
const CATEGORY_PRIORITY = ["Travel", "Electronics", "Health", "Fashion & Beauty", "Food"];

function resolveMultiCart(deals: Deal[]) {
  const byCategory: Record<string, Deal[]> = {};
  for (const deal of deals) {
    if (!byCategory[deal.category]) byCategory[deal.category] = [];
    byCategory[deal.category].push(deal);
  }

  const categories = Object.keys(byCategory);

  if (categories.length <= 1) {
    const deal = deals.sort((a, b) => b.dealValue - a.dealValue)[0];
    const classification = classifyIntent(deal);
    const topPricing = calculatePremium(deal.dealValue, classification.top, deal.riskTier);
    const secondPricing = calculatePremium(deal.dealValue, classification.second, deal.riskTier);
    return {
      strategy: "single_category" as const,
      message: `All deals in ${categories[0]} — showing top 2 insurance products.`,
      recommendations: [
        {
          deal,
          product: classification.top,
          premium: topPricing.premium,
          copy: generateCopy(deal, classification.top, topPricing.premium),
          confidence: classification.confidence,
        },
        {
          deal,
          product: classification.second,
          premium: secondPricing.premium,
          copy: generateCopy(deal, classification.second, secondPricing.premium),
          confidence: classification.secondConfidence,
        },
      ],
    };
  }

  // Multiple categories: pick highest-value deal per category, sort by priority
  const sorted = categories.sort(
    (a, b) => CATEGORY_PRIORITY.indexOf(a) - CATEGORY_PRIORITY.indexOf(b)
  );

  const recommendations = sorted.map((cat) => {
    const deal = byCategory[cat].sort((a, b) => b.dealValue - a.dealValue)[0];
    const classification = classifyIntent(deal);
    const pricing = calculatePremium(deal.dealValue, classification.top, deal.riskTier);
    return {
      deal,
      product: classification.top,
      premium: pricing.premium,
      copy: generateCopy(deal, classification.top, pricing.premium),
      confidence: classification.confidence,
      category: cat,
    };
  });

  const showAll = categories.length <= 3;

  return {
    strategy: "multi_category" as const,
    message: `${categories.length} categories detected (${sorted.join(", ")}). ${showAll ? "Showing top insurance for each." : `Showing top ${3} by priority.`}`,
    recommendations: showAll ? recommendations : recommendations.slice(0, 3),
  };
}

// ═══════════════════════════════════════════════════════════════
// IN-MEMORY DATA STORAGE
// ═══════════════════════════════════════════════════════════════
const sessions = new Map<
  string,
  {
    sessionId: string;
    variant: string;
    deals: string[];
    conversions: number;
    createdAt: string;
  }
>();
const conversions: Array<{
  sessionId: string;
  productId: string;
  productName: string;
  premium: number;
  variant: string;
  dealValue: number;
  category: string;
  merchantName: string;
  timestamp: string;
}> = [];
const cartItems = new Map<
  string,
  Array<{
    deal: Deal;
    productId: string;
    productName: string;
    premium: number;
    copy: string;
    addedAt: string;
  }>
>();

// ═══════════════════════════════════════════════════════════════
// MOCK DEAL SCENARIOS (10 deals, 5 categories)
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
// EXPRESS HTTP API (for frontend)
// ═══════════════════════════════════════════════════════════════
function createHttpServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", products: INSURANCE_CATALOG.length, brands: Object.keys(BRANDS).length });
  });

  // Product catalog
  app.get("/api/products", (_req: Request, res: Response) => {
    res.json({ products: INSURANCE_CATALOG });
  });

  // Brand info
  app.get("/api/brands", (_req: Request, res: Response) => {
    res.json({ brands: BRANDS });
  });

  // Mock deals
  app.get("/api/deals", (_req: Request, res: Response) => {
    res.json({ deals: MOCK_DEALS });
  });

  // Main recommendation endpoint
  app.post("/api/recommend", async (req: Request, res: Response) => {
    try {
      const { deal, sessionId } = req.body as { deal: Deal; sessionId: string };

      // A/B variant assignment (sticky per session)
      const variants = ["variant_A", "variant_B", "variant_C"] as const;
      let variant: string;
      if (sessions.has(sessionId)) {
        variant = sessions.get(sessionId)!.variant;
      } else {
        variant = variants[Math.floor(Math.random() * 3)];
      }

      // Classification
      const classification = classifyIntent(deal);

      // Pricing
      const topPricing = calculatePremium(deal.dealValue, classification.top, deal.riskTier);
      const secondPricing = calculatePremium(deal.dealValue, classification.second, deal.riskTier);

      // Copy generation
      const topCopy = generateCopy(deal, classification.top, topPricing.premium);
      const secondCopy = generateCopy(deal, classification.second, secondPricing.premium);

      // Store session
      if (!sessions.has(sessionId)) {
        sessions.set(sessionId, {
          sessionId,
          variant,
          deals: [],
          conversions: 0,
          createdAt: new Date().toISOString(),
        });
      }
      sessions.get(sessionId)!.deals.push(deal.merchantName);

      // Brand info
      const brand = BRANDS[deal.merchantName] || { color: "#667eea", icon: "🏪", tagline: "", domain: "" };

      res.json({
        success: true,
        recommendations: [
          {
            product: classification.top,
            premium: topPricing.premium,
            pricing: topPricing.breakdown,
            copy: topCopy,
            activeCopy: (topCopy as any)[variant],
            confidence: classification.confidence,
          },
          {
            product: classification.second,
            premium: secondPricing.premium,
            pricing: secondPricing.breakdown,
            copy: secondCopy,
            activeCopy: (secondCopy as any)[variant],
            confidence: classification.secondConfidence,
          },
        ],
        variant,
        sessionId,
        classification: {
          reasoning: classification.reasoning,
          isAmbiguous: classification.isAmbiguous,
          isBundleOpportunity: classification.isBundleOpportunity,
        },
        brand,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Multi-cart resolution
  app.post("/api/multi-cart/resolve", (req: Request, res: Response) => {
    try {
      const { deals } = req.body as { deals: Deal[] };
      const result = resolveMultiCart(deals);
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Conversion tracking
  app.post("/api/conversion", (req: Request, res: Response) => {
    const { sessionId, productId, productName, premium, variant, dealValue, category, merchantName } = req.body;
    conversions.push({
      sessionId,
      productId,
      productName: productName || productId,
      premium,
      variant,
      dealValue,
      category,
      merchantName: merchantName || "",
      timestamp: new Date().toISOString(),
    });
    if (sessions.has(sessionId)) {
      sessions.get(sessionId)!.conversions++;
    }
    res.json({ success: true, conversionId: `conv_${Date.now()}` });
  });

  // Analytics dashboard data
  app.get("/api/analytics", (_req: Request, res: Response) => {
    const variantStats: Record<string, { conversions: number; revenue: number; deals: string[] }> = {
      variant_A: { conversions: 0, revenue: 0, deals: [] },
      variant_B: { conversions: 0, revenue: 0, deals: [] },
      variant_C: { conversions: 0, revenue: 0, deals: [] },
    };

    const categoryRevenue: Record<string, number> = {};
    const productCounts: Record<string, { count: number; revenue: number; name: string }> = {};
    const merchantCounts: Record<string, number> = {};

    for (const c of conversions) {
      // Variant stats
      if (variantStats[c.variant]) {
        variantStats[c.variant].conversions++;
        variantStats[c.variant].revenue += c.premium;
        if (!variantStats[c.variant].deals.includes(c.merchantName)) {
          variantStats[c.variant].deals.push(c.merchantName);
        }
      }
      // Category revenue
      categoryRevenue[c.category] = (categoryRevenue[c.category] || 0) + c.premium;
      // Product counts
      if (!productCounts[c.productId]) {
        productCounts[c.productId] = { count: 0, revenue: 0, name: c.productName };
      }
      productCounts[c.productId].count++;
      productCounts[c.productId].revenue += c.premium;
      // Merchant counts
      merchantCounts[c.merchantName] = (merchantCounts[c.merchantName] || 0) + 1;
    }

    const totalRevenue = conversions.reduce((sum, c) => sum + c.premium, 0);
    const avgPremium = conversions.length > 0 ? Math.round(totalRevenue / conversions.length) : 0;

    res.json({
      success: true,
      totalSessions: sessions.size,
      totalConversions: conversions.length,
      conversionRate: sessions.size > 0 ? ((conversions.length / sessions.size) * 100).toFixed(1) : "0.0",
      totalRevenue,
      avgPremium,
      variantStats,
      categoryRevenue,
      topProducts: Object.entries(productCounts)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5)
        .map(([id, data]) => ({ id, ...data })),
      merchantBreakdown: merchantCounts,
      recentConversions: conversions.slice(-10).reverse(),
    });
  });

  // Cart operations
  app.post("/api/cart/add", (req: Request, res: Response) => {
    const { sessionId, deal, productId, productName, premium, copy } = req.body;
    if (!cartItems.has(sessionId)) cartItems.set(sessionId, []);
    cartItems.get(sessionId)!.push({
      deal,
      productId,
      productName: productName || productId,
      premium,
      copy: copy || "",
      addedAt: new Date().toISOString(),
    });
    res.json({ success: true, cartSize: cartItems.get(sessionId)!.length });
  });

  app.get("/api/cart/:sessionId", (req: Request, res: Response) => {
    const items = cartItems.get(req.params.sessionId) || [];
    const total = items.reduce((sum, item) => sum + item.premium, 0);
    const categories = [...new Set(items.map((i) => i.deal.category))];
    res.json({ items, total, count: items.length, categories });
  });

  app.delete("/api/cart/:sessionId/:index", (req: Request, res: Response) => {
    const items = cartItems.get(req.params.sessionId) || [];
    const idx = parseInt(req.params.index);
    if (idx >= 0 && idx < items.length) {
      items.splice(idx, 1);
    }
    res.json({ success: true, remaining: items.length });
  });

  return app;
}

// ═══════════════════════════════════════════════════════════════
// MCP STDIO SERVER (for Claude Desktop)
// JSON-RPC 2.0 over stdio
// ═══════════════════════════════════════════════════════════════
const MCP_TOOLS = [
  {
    name: "classify_deal",
    description:
      "Classify a deal and get top 2 insurance product recommendations with confidence scores. Takes deal info (merchant, category, subcategory, value, risk) and returns the best matching insurance products with dynamic pricing and personalized copy.",
    inputSchema: {
      type: "object" as const,
      properties: {
        merchantName: { type: "string", description: "Merchant name (e.g., Emirates Airline, Apple Store)" },
        category: {
          type: "string",
          enum: ["Travel", "Electronics", "Health", "Food", "Fashion & Beauty"],
          description: "Deal category",
        },
        subcategory: {
          type: "string",
          description: "Deal subcategory (e.g., Flight, iPhone, Diagnosis, Delivery, Apparel)",
        },
        dealValue: { type: "number", description: "Deal value in INR (e.g., 45000)" },
        riskTier: { type: "string", enum: ["low", "medium", "high"], description: "User risk tier" },
      },
      required: ["merchantName", "category", "subcategory", "dealValue"],
    },
  },
  {
    name: "get_premium_quote",
    description: "Get a dynamic premium quote for a specific insurance product based on deal value and risk tier.",
    inputSchema: {
      type: "object" as const,
      properties: {
        productId: {
          type: "string",
          description: "Insurance product ID",
          enum: INSURANCE_CATALOG.map((p) => p.id),
        },
        dealValue: { type: "number", description: "Deal value in INR" },
        riskTier: { type: "string", enum: ["low", "medium", "high"] },
      },
      required: ["productId", "dealValue"],
    },
  },
  {
    name: "generate_offer_copy",
    description:
      "Generate hyper-personalized insurance offer copy for a deal. Returns 3 A/B variants: Direct (A), Emotional (B), Social proof (C).",
    inputSchema: {
      type: "object" as const,
      properties: {
        merchantName: { type: "string" },
        category: { type: "string" },
        subcategory: { type: "string" },
        dealValue: { type: "number" },
        productId: { type: "string" },
        premium: { type: "number" },
      },
      required: ["merchantName", "category", "dealValue", "productId", "premium"],
    },
  },
  {
    name: "list_insurance_products",
    description:
      "List all available insurance products in the catalog, optionally filtered by category.",
    inputSchema: {
      type: "object" as const,
      properties: {
        category: {
          type: "string",
          description: "Filter by category (optional)",
          enum: ["Travel", "Electronics", "Health", "Food", "Fashion & Beauty"],
        },
      },
    },
  },
  {
    name: "resolve_multi_cart",
    description:
      "Resolve insurance recommendations when a user has deals from multiple categories (e.g., Myntra + MakeMyTrip). Determines priority and which insurance products to show.",
    inputSchema: {
      type: "object" as const,
      properties: {
        deals: {
          type: "array",
          description: "Array of deal objects",
          items: {
            type: "object",
            properties: {
              merchantName: { type: "string" },
              category: { type: "string" },
              subcategory: { type: "string" },
              dealValue: { type: "number" },
              riskTier: { type: "string" },
            },
          },
        },
      },
      required: ["deals"],
    },
  },
  {
    name: "get_brand_info",
    description: "Get partner brand information including colors, icon, and tagline for a merchant.",
    inputSchema: {
      type: "object" as const,
      properties: {
        merchantName: { type: "string", description: "Merchant name" },
      },
      required: ["merchantName"],
    },
  },
  {
    name: "track_conversion",
    description: "Track a successful insurance sale conversion for A/B testing analytics.",
    inputSchema: {
      type: "object" as const,
      properties: {
        sessionId: { type: "string" },
        productId: { type: "string" },
        premium: { type: "number" },
        variant: { type: "string", enum: ["variant_A", "variant_B", "variant_C"] },
        dealValue: { type: "number" },
        category: { type: "string" },
        merchantName: { type: "string" },
      },
      required: ["sessionId", "productId", "premium"],
    },
  },
  {
    name: "get_analytics",
    description:
      "Get A/B testing analytics: conversion rates, variant performance, revenue by category, and top products.",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "run_test_scenarios",
    description: "Run all 10 mock deal scenarios and return classification results for each.",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
];

async function handleMcpToolCall(name: string, args: any): Promise<string> {
  switch (name) {
    case "classify_deal": {
      const deal: Deal = {
        merchantName: args.merchantName,
        category: args.category,
        subcategory: args.subcategory || "",
        dealValue: args.dealValue,
        riskTier: args.riskTier || "medium",
        userHistory: args.userHistory,
      };
      const result = classifyIntent(deal);
      const topPricing = calculatePremium(deal.dealValue, result.top, deal.riskTier);
      const secondPricing = calculatePremium(deal.dealValue, result.second, deal.riskTier);
      const topCopy = generateCopy(deal, result.top, topPricing.premium);
      const secondCopy = generateCopy(deal, result.second, secondPricing.premium);

      return JSON.stringify(
        {
          primary: {
            product: result.top.name,
            productId: result.top.id,
            coverage: result.top.coverage,
            premium: topPricing.premium,
            pricing: topPricing.breakdown,
            confidence: `${Math.round(result.confidence * 100)}%`,
            copy: topCopy,
          },
          secondary: {
            product: result.second.name,
            productId: result.second.id,
            coverage: result.second.coverage,
            premium: secondPricing.premium,
            pricing: secondPricing.breakdown,
            confidence: `${Math.round(result.secondConfidence * 100)}%`,
            copy: secondCopy,
          },
          reasoning: result.reasoning,
          isAmbiguous: result.isAmbiguous,
          isBundleOpportunity: result.isBundleOpportunity,
        },
        null,
        2
      );
    }

    case "get_premium_quote": {
      const product = INSURANCE_CATALOG.find((p) => p.id === args.productId);
      if (!product) return JSON.stringify({ error: `Product "${args.productId}" not found` });
      const pricing = calculatePremium(args.dealValue, product, args.riskTier || "medium");
      return JSON.stringify({ product: product.name, ...pricing }, null, 2);
    }

    case "generate_offer_copy": {
      const product = INSURANCE_CATALOG.find((p) => p.id === args.productId);
      if (!product) return JSON.stringify({ error: `Product "${args.productId}" not found` });
      const deal: Deal = {
        merchantName: args.merchantName,
        category: args.category || "Electronics",
        subcategory: args.subcategory || "",
        dealValue: args.dealValue,
      };
      const copy = generateCopy(deal, product, args.premium);
      return JSON.stringify(
        {
          product: product.name,
          copy,
          note: "variant_A = Direct/value-focused, variant_B = Emotional/fear-based, variant_C = Social proof",
        },
        null,
        2
      );
    }

    case "list_insurance_products": {
      const filtered = args.category
        ? INSURANCE_CATALOG.filter((p) => p.categories.includes(args.category))
        : INSURANCE_CATALOG;
      return JSON.stringify(
        {
          count: filtered.length,
          products: filtered.map((p) => ({
            id: p.id,
            name: p.name,
            coverage: p.coverage,
            startingFrom: `₹${p.minPremium}`,
            categories: p.categories,
            icon: p.icon,
            description: p.description,
          })),
        },
        null,
        2
      );
    }

    case "resolve_multi_cart": {
      const result = resolveMultiCart(args.deals);
      return JSON.stringify(result, null, 2);
    }

    case "get_brand_info": {
      const brand = BRANDS[args.merchantName];
      if (!brand) {
        return JSON.stringify({
          error: `Brand "${args.merchantName}" not found`,
          available: Object.keys(BRANDS),
        });
      }
      return JSON.stringify({ merchantName: args.merchantName, ...brand }, null, 2);
    }

    case "track_conversion": {
      conversions.push({
        sessionId: args.sessionId || `mcp_${Date.now()}`,
        productId: args.productId,
        productName: INSURANCE_CATALOG.find((p) => p.id === args.productId)?.name || args.productId,
        premium: args.premium,
        variant: args.variant || "variant_A",
        dealValue: args.dealValue || 0,
        category: args.category || "",
        merchantName: args.merchantName || "",
        timestamp: new Date().toISOString(),
      });
      return JSON.stringify({
        success: true,
        totalConversions: conversions.length,
        conversionId: `conv_${Date.now()}`,
      });
    }

    case "get_analytics": {
      const variantStats: Record<string, number> = { variant_A: 0, variant_B: 0, variant_C: 0 };
      const categoryRevenue: Record<string, number> = {};
      for (const c of conversions) {
        variantStats[c.variant] = (variantStats[c.variant] || 0) + 1;
        categoryRevenue[c.category] = (categoryRevenue[c.category] || 0) + c.premium;
      }
      return JSON.stringify(
        {
          totalSessions: sessions.size,
          totalConversions: conversions.length,
          totalRevenue: conversions.reduce((s, c) => s + c.premium, 0),
          variantStats,
          categoryRevenue,
          recentConversions: conversions.slice(-5),
        },
        null,
        2
      );
    }

    case "run_test_scenarios": {
      const results = MOCK_DEALS.map((deal) => {
        const classification = classifyIntent(deal);
        const pricing = calculatePremium(deal.dealValue, classification.top, deal.riskTier);
        const copy = generateCopy(deal, classification.top, pricing.premium);
        return {
          merchant: deal.merchantName,
          category: deal.category,
          subcategory: deal.subcategory,
          dealValue: `₹${deal.dealValue}`,
          topProduct: classification.top.name,
          premium: `₹${pricing.premium}`,
          confidence: `${Math.round(classification.confidence * 100)}%`,
          sampleCopy: copy.variant_A,
          reasoning: classification.reasoning,
        };
      });
      return JSON.stringify({ scenarios: results, count: results.length }, null, 2);
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}

function startMcpStdioServer() {
  const rl = createInterface({ input: process.stdin, terminal: false });

  function send(msg: object) {
    const line = JSON.stringify(msg);
    process.stdout.write(line + "\n");
  }

  function log(msg: string) {
    process.stderr.write(`[GrabInsurance MCP] ${msg}\n`);
  }

  log("Starting MCP stdio server...");

  rl.on("line", async (line: string) => {
    if (!line.trim()) return;

    try {
      const message = JSON.parse(line);

      // Notifications (no id) don't get a response
      if (!message.id && message.method) {
        log(`Notification: ${message.method}`);
        return;
      }

      switch (message.method) {
        case "initialize":
          send({
            jsonrpc: "2.0",
            id: message.id,
            result: {
              protocolVersion: "2024-11-05",
              capabilities: {
                tools: {},
              },
              serverInfo: {
                name: "grabinsurance",
                version: "1.0.0",
              },
            },
          });
          log("Initialized successfully");
          break;

        case "tools/list":
          send({
            jsonrpc: "2.0",
            id: message.id,
            result: { tools: MCP_TOOLS },
          });
          log(`Listed ${MCP_TOOLS.length} tools`);
          break;

        case "tools/call": {
          const { name, arguments: toolArgs } = message.params;
          log(`Tool call: ${name}`);
          try {
            const result = await handleMcpToolCall(name, toolArgs || {});
            send({
              jsonrpc: "2.0",
              id: message.id,
              result: {
                content: [{ type: "text", text: result }],
              },
            });
          } catch (err: any) {
            send({
              jsonrpc: "2.0",
              id: message.id,
              result: {
                content: [{ type: "text", text: `Error: ${err.message}` }],
                isError: true,
              },
            });
          }
          break;
        }

        case "resources/list":
          send({ jsonrpc: "2.0", id: message.id, result: { resources: [] } });
          break;

        case "prompts/list":
          send({ jsonrpc: "2.0", id: message.id, result: { prompts: [] } });
          break;

        default:
          if (message.id) {
            send({
              jsonrpc: "2.0",
              id: message.id,
              error: { code: -32601, message: `Method not found: ${message.method}` },
            });
          }
      }
    } catch (err: any) {
      log(`Parse error: ${err.message}`);
    }
  });

  rl.on("close", () => process.exit(0));
  process.on("SIGINT", () => process.exit(0));
}

// ═══════════════════════════════════════════════════════════════
// ENTRY POINT
// ═══════════════════════════════════════════════════════════════
const isStdioMode = process.argv.includes("--stdio");

if (isStdioMode) {
  startMcpStdioServer();
} else {
  const app = createHttpServer();
  const PORT = parseInt(process.env.PORT || "8000");
  app.listen(PORT, () => {
    console.log(`\n  GrabInsurance Server running on http://localhost:${PORT}\n`);
    console.log(`  API Endpoints:`);
    console.log(`    GET  /api/health        - Health check`);
    console.log(`    GET  /api/products       - Insurance catalog`);
    console.log(`    GET  /api/brands         - Partner brands`);
    console.log(`    GET  /api/deals          - Mock deal scenarios`);
    console.log(`    POST /api/recommend      - Get insurance recommendations`);
    console.log(`    POST /api/conversion     - Track conversion`);
    console.log(`    GET  /api/analytics      - A/B testing dashboard`);
    console.log(`    POST /api/cart/add       - Add to cart`);
    console.log(`    GET  /api/cart/:id       - Get cart`);
    console.log(`    POST /api/multi-cart/resolve - Multi-category resolution\n`);
    console.log(`  For Claude Desktop: use --stdio flag\n`);
  });
}
