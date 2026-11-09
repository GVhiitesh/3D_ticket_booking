import React, { useState, useEffect } from 'react';
import { Show, Movie, Booking } from '../types';

interface CheckoutPageProps {
  show: Show;
  movie: Movie;
  selectedSeatCodes: string[];
  subtotal: number;
  currentUser?: { name: string; email: string; phone?: string } | null;
  onPaymentSuccess: (booking: Booking) => void;
  onBack: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  show,
  movie,
  selectedSeatCodes,
  subtotal,
  currentUser,
  onPaymentSuccess,
  onBack,
}) => {
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Film Enthusiast');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'customer@cineva.com');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+44 7700 900077');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [agreePolicy, setAgreePolicy] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [holdSeconds, setHoldSeconds] = useState(540); // 9 minutes left

  const taxAmount = +(subtotal * 0.18).toFixed(2);
  const convenienceFee = 0.0;
  const totalAmount = +(subtotal + convenienceFee + taxAmount).toFixed(2);

  useEffect(() => {
    if (holdSeconds <= 0) return;
    const interval = setInterval(() => {
      setHoldSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [holdSeconds]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handlePay = async () => {
    if (!agreePolicy) {
      alert('Please agree to the Cinema Cancellation & Refund Policy before proceeding.');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/v1/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showId: show.id,
          seatCodes: selectedSeatCodes,
          customerName,
          customerEmail,
          customerPhone,
          paymentMethod,
          gatewayPaymentId: `pay_${Date.now()}`,
        }),
      });

      const result = await response.json();
      setIsProcessing(false);

      if (result.success && result.data) {
        onPaymentSuccess(result.data);
      } else {
        alert(result.message || 'Payment processing failed. Please retry.');
      }
    } catch (err: any) {
      setIsProcessing(false);
      alert('Network error connecting to payment gateway: ' + err.message);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white pt-24 pb-20 px-5 md:px-12 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        {/* Top Header & Hold Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#1c1b1b] border border-white/5 shadow-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-[#111111] hover:bg-[#2a2a2a] flex items-center justify-center text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
            <div>
              <span className="text-[10px] text-[#ff6500] uppercase font-bold tracking-widest font-['Geist']">
                Order Review &amp; Payment
              </span>
              <h1 className="font-['Space_Grotesk'] text-xl font-bold text-white">
                Finalize Ticket Booking
              </h1>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0e0e0e] border border-[#ff6500]/30 shadow-[0_0_15px_rgba(255,101,0,0.2)]">
            <span className="material-symbols-outlined text-[#ff6500] text-[20px] animate-pulse">lock_clock</span>
            <div className="text-xs font-['Geist']">
              <span className="text-[#aa8a7d]">Hold Expires in: </span>
              <strong className="text-white font-mono text-sm">{formatTimer(holdSeconds)}</strong>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Details on Left, Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customer info & Payment Methods (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Contact Details Card */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-white/5 flex flex-col gap-4 shadow-xl">
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff6500] text-[20px]">badge</span>
                Ticket Delivery Details
              </h3>

              <div className="flex flex-col gap-3 font-['Geist'] text-xs">
                <div>
                  <label className="block text-[#e3bfb1] mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#1c1b1b] text-white px-4 py-2.5 rounded-xl border border-white/5 focus:border-[#ff6500] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#e3bfb1] mb-1 font-medium">Email Address</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-[#1c1b1b] text-white px-4 py-2.5 rounded-xl border border-white/5 focus:border-[#ff6500] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#e3bfb1] mb-1 font-medium">Mobile Phone (for SMS Tickets)</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#1c1b1b] text-white px-4 py-2.5 rounded-xl border border-white/5 focus:border-[#ff6500] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-white/5 flex flex-col gap-4 shadow-xl">
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff6500] text-[20px]">payment</span>
                Select Payment Method
              </h3>

              <div className="flex flex-col gap-3">
                {/* UPI Option */}
                <label
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'UPI'
                      ? 'bg-[#1c1b1b] border-[#ff6500] shadow-[0_0_15px_rgba(255,101,0,0.2)]'
                      : 'bg-[#141414] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-[#ff6500] flex items-center justify-center">
                      {paymentMethod === 'UPI' && <div className="w-2.5 h-2.5 rounded-full bg-[#ff6500]" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white font-['Space_Grotesk']">
                        Instant UPI &bull; Google Pay / PhonePe
                      </div>
                      <div className="text-[10px] text-[#aa8a7d] font-['Geist']">
                        Zero processing fee &bull; Fast QR scan on mobile
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#ffb596] text-[24px]">qr_code_scanner</span>
                </label>

                {/* Card Option */}
                <label
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'CARD'
                      ? 'bg-[#1c1b1b] border-[#ff6500] shadow-[0_0_15px_rgba(255,101,0,0.2)]'
                      : 'bg-[#141414] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-[#ff6500] flex items-center justify-center">
                      {paymentMethod === 'CARD' && <div className="w-2.5 h-2.5 rounded-full bg-[#ff6500]" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white font-['Space_Grotesk']">
                        Credit or Debit Card
                      </div>
                      <div className="text-[10px] text-[#aa8a7d] font-['Geist']">
                        Visa, Mastercard, Amex with 3D Secure
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#ffb596] text-[24px]">credit_card</span>
                </label>
              </div>
            </div>

            {/* Cancellation Policy Checkbox */}
            <div className="p-4 rounded-xl bg-[#141414] border border-white/5 flex items-start gap-3">
              <input
                type="checkbox"
                id="policy"
                checked={agreePolicy}
                onChange={(e) => setAgreePolicy(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-[#ff6500] bg-[#1c1b1b] border-white/10 focus:ring-0"
              />
              <label htmlFor="policy" className="text-xs text-[#e3bfb1] font-['Geist'] leading-relaxed cursor-pointer">
                I accept the <strong className="text-white">CINEVA Cancellation &amp; Refund Policy</strong>. Bookings can be cancelled up to 2 hours before showtime for an 80% refund.
              </label>
            </div>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#111111] border border-white/5 shadow-2xl flex flex-col gap-6">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">Order Summary</h3>

            {/* Movie Info */}
            <div className="flex items-center gap-4 pb-4 border-b border-white/5">
              <img
                alt={movie.title}
                src={movie.posterUrl}
                className="w-16 h-22 object-cover rounded-lg shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#ff6500] tracking-wider font-['Geist']">
                  {show.screenFormat}
                </span>
                <h4 className="font-['Space_Grotesk'] text-base font-bold text-white">{movie.title}</h4>
                <span className="text-xs text-[#e3bfb1] font-['Geist']">{show.branchName}</span>
                <span className="text-xs text-[#ffb596] font-semibold font-['Geist'] mt-0.5">
                  {show.date} &bull; {show.startTime} BST
                </span>
              </div>
            </div>

            {/* Seats */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[#aa8a7d] font-['Geist']">Selected Seats ({selectedSeatCodes.length})</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSeatCodes.map((code) => (
                  <span
                    key={code}
                    className="px-2.5 py-1 rounded-md bg-[#1c1b1b] text-white text-xs font-bold font-['Space_Grotesk'] border border-white/5"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>

            {/* Fare Breakdown */}
            <div className="space-y-2 text-xs font-['Geist'] border-t border-white/5 pt-4">
              <div className="flex items-center justify-between text-[#e3bfb1]">
                <span>Tickets Subtotal</span>
                <span className="text-white font-medium">£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[#e3bfb1]">
                <span>GST / VAT (18%)</span>
                <span className="text-white font-medium">£{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[#e3bfb1]">
                <span>Convenience / Preservation Fee</span>
                <span className="text-[#ffb596] font-medium">Free</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-lg font-['Space_Grotesk'] font-bold text-white">
                <span>Grand Total</span>
                <span className="text-[#ff6500]">£{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#ff6500] to-[#b74600] hover:from-[#ff771a] hover:to-[#c94f00] text-white font-['Geist'] text-sm font-bold uppercase tracking-wider transition-all shadow-[0_12px_32px_rgba(255,101,0,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isProcessing ? 'Verifying & Confirming...' : `Pay £${totalAmount.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
