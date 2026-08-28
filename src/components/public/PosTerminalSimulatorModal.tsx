import React, { useState } from "react";
import { POS_DEMO_PRODUCTS } from "../../data/packagesData";
import type { PosDemoProduct } from "../../types";
import {
  X,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Barcode,
  CreditCard,
  Smartphone,
  Banknote,
  Receipt,
  CheckCircle2,
  Printer,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Tag,
  Zap,
} from "lucide-react";

interface PosTerminalSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchFullERP?: () => void;
}

interface CartItem {
  product: PosDemoProduct;
  quantity: number;
}

export const PosTerminalSimulatorModal: React.FC<PosTerminalSimulatorModalProps> = ({
  isOpen,
  onClose,
  onLaunchFullERP,
}) => {
  const [cart, setCart] = useState<CartItem[]>([
    { product: POS_DEMO_PRODUCTS[0], quantity: 2 },
    { product: POS_DEMO_PRODUCTS[1], quantity: 1 },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "cash" | "card">("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("0712 345 678");
  const [cashTendered, setCashTendered] = useState<string>("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showStkPrompt, setShowStkPrompt] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    receiptNo: string;
    transId: string;
    paidAmount: number;
    change: number;
    method: string;
    time: string;
  } | null>(null);

  if (!isOpen) return null;

  const categories = ["All", "Dairy & Beverage", "Bakery", "Groceries", "Electronics", "Health & Household"];

  const filteredProducts = POS_DEMO_PRODUCTS.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (product: PosDemoProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setPaymentSuccessData(null);
  };

  // Calculations
  const rawSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const subtotalAfterDiscount = rawSubtotal - discountAmount;
  const estimatedTax = Math.round(subtotalAfterDiscount * 0.138); // 16% VAT portion included
  const totalPayable = subtotalAfterDiscount;

  const handleSimulateScan = () => {
    // Pick random product to simulate laser scan
    const randomProduct = POS_DEMO_PRODUCTS[Math.floor(Math.random() * POS_DEMO_PRODUCTS.length)];
    addToCart(randomProduct);
  };

  const handleProcessPayment = () => {
    if (cart.length === 0) return;

    if (paymentMethod === "mpesa") {
      setShowStkPrompt(true);
      setIsProcessingPayment(true);
      setTimeout(() => {
        setIsProcessingPayment(false);
        setShowStkPrompt(false);
        setPaymentSuccessData({
          receiptNo: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
          transId: `MPE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          paidAmount: totalPayable,
          change: 0,
          method: "M-Pesa STK (Daraja 3.0)",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        });
      }, 3500);
    } else if (paymentMethod === "cash") {
      const tendered = parseFloat(cashTendered) || totalPayable;
      const change = Math.max(0, tendered - totalPayable);
      setIsProcessingPayment(true);
      setTimeout(() => {
        setIsProcessingPayment(false);
        setPaymentSuccessData({
          receiptNo: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
          transId: `CSH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          paidAmount: tendered,
          change: change,
          method: "Cash Drawer",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        });
      }, 1000);
    } else {
      setIsProcessingPayment(true);
      setTimeout(() => {
        setIsProcessingPayment(false);
        setPaymentSuccessData({
          receiptNo: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
          transId: `EMV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          paidAmount: totalPayable,
          change: 0,
          method: "EMV Chip / Contactless Card",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        });
      }, 1500);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  DAVETECH Point of Sale (POS) & Retail Terminal
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Interactive Live Simulator
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Register #01 • Cashier: Dave Muchiri • Store: Davetech Supermarket & Retail Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSimulateScan}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-600/30 transition-colors"
            >
              <Barcode className="w-4 h-4 text-emerald-400" />
              <span>Simulate Laser Scan</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Terminal Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-900 text-white">
          {/* Left Column: Product Catalog & Category Navigation (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 overflow-y-auto">
            {/* Search & Category Header */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search item by name, category, or scan barcode (e.g. Milk, 616110...)"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-emerald-500 text-slate-950 shadow-sm font-bold"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto pr-1 flex-1">
              {filteredProducts.map((product) => {
                const inCart = cart.find((i) => i.product.id === product.id);
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => addToCart(product)}
                    className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between group relative overflow-hidden ${
                      inCart
                        ? "bg-emerald-950/40 border-emerald-500/50 shadow-xs"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800/40"
                    }`}
                  >
                    {inCart && (
                      <span className="absolute top-2 right-2 bg-emerald-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                        {inCart.quantity}
                      </span>
                    )}
                    <div>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-20 object-cover rounded-lg mb-2 bg-slate-900 border border-slate-800 group-hover:scale-102 transition-transform"
                      />
                      <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-0.5">
                        {product.category}
                      </div>
                      <div className="text-xs font-bold text-white line-clamp-2 leading-tight">
                        {product.name}
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-400">
                        KES {product.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {product.stock} in stock
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Checkout Cart, Payment Engine & Thermal Receipt (5 cols) */}
          <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col bg-slate-950 overflow-y-auto">
            {paymentSuccessData ? (
              /* Thermal Receipt Screen */
              <div className="flex-1 flex flex-col justify-between animate-in zoom-in-95 duration-200">
                <div className="bg-white text-slate-900 p-5 rounded-xl font-mono text-xs shadow-xl border border-slate-200 space-y-3">
                  <div className="text-center border-b border-dashed border-slate-300 pb-3">
                    <div className="text-sm font-extrabold tracking-wider uppercase text-slate-950">
                      DAVETECH RETAIL POS
                    </div>
                    <div className="text-[10px] text-slate-600">P.O. BOX 4802 - NAIROBI, KENYA</div>
                    <div className="text-[10px] text-slate-600">TEL: +254 700 000 000 • PIN: P051289410Z</div>
                    <div className="text-[10px] font-bold text-emerald-700 mt-1">*** OFFICIAL RECEIPT ***</div>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>RECEIPT: {paymentSuccessData.receiptNo}</span>
                    <span>TIME: {paymentSuccessData.time}</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <span>TRANS ID: {paymentSuccessData.transId}</span>
                  </div>

                  <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1">
                    <div className="flex justify-between font-bold text-[11px] text-slate-900">
                      <span>ITEM</span>
                      <span>QTY x PRICE</span>
                      <span>TOTAL</span>
                    </div>
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-[11px] text-slate-800">
                        <span className="truncate max-w-[130px]">{item.product.name}</span>
                        <span>
                          {item.quantity} x {item.product.price}
                        </span>
                        <span className="font-semibold">
                          KES {(item.quantity * item.product.price).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-600">
                      <span>SUBTOTAL:</span>
                      <span>KES {rawSubtotal.toLocaleString()}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>DISCOUNT ({discountPercent}%):</span>
                        <span>-KES {discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>INCL. 16% VAT:</span>
                      <span>KES {estimatedTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-950 border-t border-dashed border-slate-300 pt-1.5">
                      <span>TOTAL PAID:</span>
                      <span>KES {paymentSuccessData.paidAmount.toLocaleString()}</span>
                    </div>
                    {paymentSuccessData.change > 0 && (
                      <div className="flex justify-between text-slate-800 font-bold">
                        <span>CHANGE RETURNED:</span>
                        <span>KES {paymentSuccessData.change.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="text-[10px] text-slate-500 pt-1">
                      PAYMENT METHOD: {paymentSuccessData.method}
                    </div>
                  </div>

                  <div className="text-center border-t border-dashed border-slate-300 pt-3 text-[10px] text-slate-600 space-y-1">
                    <div>THANK YOU FOR SHOPPING WITH US!</div>
                    <div className="font-bold text-indigo-700">POWERED BY DAVETECH POS SYSTEM</div>
                    <div className="text-[9px] text-slate-400">Goods once sold are subject to store return policy</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
                  >
                    <Printer className="w-4 h-4 text-emerald-400" />
                    <span>Print Thermal Receipt</span>
                  </button>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>New POS Sale</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Active POS Register Cart */
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                      <ShoppingCart className="w-4 h-4 text-emerald-400" />
                      <span>Current Register Cart</span>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.2 rounded-full font-mono">
                        {cart.reduce((a, b) => a + b.quantity, 0)} items
                      </span>
                    </div>
                    {cart.length > 0 && (
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>

                  {/* Cart Item Rows */}
                  <div className="max-h-44 sm:max-h-52 overflow-y-auto divide-y divide-slate-800/80 py-1">
                    {cart.length === 0 ? (
                      <div className="py-8 text-center text-slate-500 text-xs space-y-2">
                        <ShoppingCart className="w-8 h-8 mx-auto text-slate-700" />
                        <div>No items in register cart yet.</div>
                        <p className="text-[11px] text-slate-600">
                          Click products on the left or click &ldquo;Simulate Laser Scan&rdquo;.
                        </p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.product.id} className="py-2 flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-200 truncate">
                              {item.product.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              KES {item.product.price.toLocaleString()} each
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold font-mono">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-xs font-extrabold text-emerald-400 w-20 text-right font-mono">
                            KES {(item.quantity * item.product.price).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Totals & Payment Section */}
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
                  {/* Discount Selector */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-amber-400" />
                      <span>Cashier Discount:</span>
                    </span>
                    <div className="flex items-center gap-1">
                      {[0, 5, 10, 15].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDiscountPercent(d)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                            discountPercent === d
                              ? "bg-amber-500 text-slate-950"
                              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                          }`}
                        >
                          {d}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary Breakdown */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal:</span>
                      <span className="font-mono">KES {rawSubtotal.toLocaleString()}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-amber-400">
                        <span>Discount ({discountPercent}%):</span>
                        <span className="font-mono">-KES {discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400">
                      <span>16% VAT Portion:</span>
                      <span className="font-mono">KES {estimatedTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-white border-t border-slate-800 pt-2">
                      <span>Total Amount:</span>
                      <span className="text-emerald-400 font-mono">
                        KES {totalPayable.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("mpesa")}
                      className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === "mpesa"
                          ? "bg-emerald-600 text-slate-950 shadow-md font-black"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>M-Pesa STK</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cash")}
                      className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === "cash"
                          ? "bg-emerald-600 text-slate-950 shadow-md font-black"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      <span>Cash Tender</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === "card"
                          ? "bg-emerald-600 text-slate-950 shadow-md font-black"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Card / POS</span>
                    </button>
                  </div>

                  {/* Method-Specific Inputs */}
                  {paymentMethod === "mpesa" && (
                    <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-2.5 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                      <input
                        type="text"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        placeholder="07XX XXX XXX"
                        className="bg-transparent text-xs text-white font-mono flex-1 focus:outline-hidden"
                      />
                      <span className="text-[10px] text-emerald-400 font-bold">Daraja 3.0</span>
                    </div>
                  )}

                  {paymentMethod === "cash" && (
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-emerald-400 shrink-0" />
                        <input
                          type="number"
                          value={cashTendered}
                          onChange={(e) => setCashTendered(e.target.value)}
                          placeholder={`Enter cash (e.g. ${totalPayable})`}
                          className="bg-transparent text-xs text-white font-mono flex-1 focus:outline-hidden"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-slate-400">Quick:</span>
                        {[totalPayable, 500, 1000, 2000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setCashTendered(amt.toString())}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded font-mono"
                          >
                            KES {amt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <button
                    type="button"
                    disabled={cart.length === 0 || isProcessingPayment}
                    onClick={handleProcessPayment}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-black tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing {paymentMethod.toUpperCase()} Transaction...</span>
                      </>
                    ) : (
                      <>
                        <Receipt className="w-4 h-4" />
                        <span>
                          Charge KES {totalPayable.toLocaleString()} ({paymentMethod.toUpperCase()})
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STK Push Simulated Mobile Popup */}
        {showStkPrompt && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 max-w-xs w-full text-center text-white shadow-2xl space-y-4">
              <div className="w-14 h-14 bg-emerald-500 text-slate-950 rounded-2xl mx-auto flex items-center justify-center">
                <Smartphone className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                  M-Pesa STK Push
                </div>
                <div className="text-sm font-bold text-white mt-1">
                  Pay KES {totalPayable.toLocaleString()} to DAVETECH POS
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Prompt sent to <span className="font-mono text-white">{mpesaPhone}</span>. Enter M-Pesa PIN to complete checkout.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-mono text-emerald-400">
                <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Waiting for customer PIN entry...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
