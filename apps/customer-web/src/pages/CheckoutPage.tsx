import React, { useState, useEffect } from 'react';
import { Show, Movie, Booking } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';

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
  const { toast } = useToast();
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
      toast({
        type: 'warning',
        title: 'Policy Agreement Required',
        message: 'Please agree to the Cinema Cancellation & Refund Policy before proceeding.',
      });
      return;
    }

    if (!customerName.trim() || !customerEmail.trim()) {
      toast({
        type: 'error',
        title: 'Missing Details',
        message: 'Please provide both your name and email for digital ticket delivery.',
      });
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
        toast({
          type: 'success',
          title: 'Payment Successful',
          message: 'Your reservation is confirmed. Generating digital entry tickets...',
        });
        onPaymentSuccess(result.data);
      } else {
        toast({
          type: 'error',
          title: 'Payment Failed',
          message: result.message || 'Payment processing failed. Please retry.',
        });
      }
    } catch (err: any) {
      setIsProcessing(false);
      toast({
        type: 'error',
        title: 'Network Error',
        message: 'Unable to connect to cinema payment gateway: ' + err.message,
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white pt-28 pb-20 px-5 md:px-12 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        {/* Top Header & Hold Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#111111] border border-[#222222] shadow-card-subtle">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Back to seat selection"
              className="w-9 h-9 rounded-full bg-[#181818] hover:bg-[#222222] flex items-center justify-center text-white transition-colors border border-[#222222]"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
            <div>
              <span className="text-[10px] text-[#FF6500] uppercase font-bold tracking-wider block">
                Order Review &amp; Payment
              </span>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Finalize Ticket Booking
              </h1>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#181818] border border-[#FF6500]/30 shadow-glow-orange-sm self-start sm:self-auto">
            <span className="material-symbols-outlined text-[#FF6500] text-[18px] animate-pulse">lock_clock</span>
            <div className="text-xs">
              <span className="text-[#A0A0A0]">Hold Window: </span>
              <strong className="text-white font-mono text-sm ml-1">{formatTimer(holdSeconds)}</strong>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Details on Left, Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customer info & Payment Methods (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Contact Details Card */}
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] flex flex-col gap-5 shadow-card-subtle">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#222222]">
                <span className="material-symbols-outlined text-[#FF6500] text-[20px]">badge</span>
                <h3 className="text-base font-bold text-white">
                  Ticket Delivery &amp; Contact Details
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. David Miller"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@cineva.com"
                    helperText="Digital QR tickets will be sent here"
                  />
                  <Input
                    label="Mobile Phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+44 7700 900077"
                    helperText="For booking SMS & gate passes"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] flex flex-col gap-5 shadow-card-subtle">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#222222]">
                <span className="material-symbols-outlined text-[#FF6500] text-[20px]">payments</span>
                <h3 className="text-base font-bold text-white">
                  Payment Method
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'UPI', label: 'Instant UPI', icon: 'qr_code_2' },
                  { id: 'CARD', label: 'Credit / Debit', icon: 'credit_card' },
                  { id: 'NETBANKING', label: 'NetBanking', icon: 'account_balance' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border ${
                      paymentMethod === pm.id
                        ? 'bg-[#181818] border-[#FF6500] text-white shadow-sm'
                        : 'bg-[#0B0B0B] border-[#222222] text-[#A0A0A0] hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[24px] ${paymentMethod === pm.id ? 'text-[#FF6500]' : ''}`}>
                      {pm.icon}
                    </span>
                    <span className="text-xs font-semibold">{pm.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0B0B] border border-[#222222] flex items-center gap-3 text-xs text-[#A0A0A0]">
                <span className="material-symbols-outlined text-[#FF6500] text-[20px]">verified_user</span>
                <span>256-bit SSL encrypted PCI-DSS compliant checkout session.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] flex flex-col gap-5 shadow-card-subtle sticky top-28">
              <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
                <h3 className="text-base font-bold text-white">
                  Reservation Summary
                </h3>
                <Badge variant="brand" size="sm">
                  {show.screenFormat}
                </Badge>
              </div>

              {/* Movie info */}
              <div className="flex gap-3.5">
                <img
                  alt={movie.title}
                  src={movie.posterUrl}
                  className="w-14 h-20 object-cover rounded-xl border border-white/5"
                />
                <div className="flex flex-col justify-center gap-0.5">
                  <h4 className="text-sm font-bold text-white line-clamp-1">{movie.title}</h4>
                  <span className="text-xs text-[#A0A0A0]">{show.branchName}</span>
                  <span className="text-xs text-[#FF6500] font-medium">{show.screenName}</span>
                  <span className="text-[11px] text-[#707070]">{show.startTime} &bull; {show.date}</span>
                </div>
              </div>

              {/* Reserved Seats Pills */}
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-[10px] text-[#707070] uppercase tracking-wider font-semibold">
                  Reserved Seats ({selectedSeatCodes.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedSeatCodes.map((code) => (
                    <span
                      key={code}
                      className="px-2.5 py-1 rounded-lg bg-[#181818] border border-[#222222] text-xs font-semibold text-white"
                    >
                      Seat {code}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="flex flex-col gap-2.5 pt-4 border-t border-[#222222] text-xs">
                <div className="flex justify-between text-[#A0A0A0]">
                  <span>Ticket Subtotal</span>
                  <span className="text-white font-medium">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#A0A0A0]">
                  <span>Online Convenience Fee</span>
                  <span className="text-emerald-400 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-[#A0A0A0]">
                  <span>VAT &amp; Entertainment Levy (18%)</span>
                  <span className="text-white font-medium">£{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#222222] text-sm font-bold text-white">
                  <span>Grand Total</span>
                  <span className="text-xl text-[#FF6500]">£{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Policy Checkbox */}
              <label className="flex items-start gap-2.5 pt-2 text-xs text-[#A0A0A0] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreePolicy}
                  onChange={(e) => setAgreePolicy(e.target.checked)}
                  className="mt-0.5 accent-[#FF6500] rounded"
                />
                <span>
                  I agree to CINEVA’s 100% Refundable Gate Cancellation terms up to 2 hours before curtain call.
                </span>
              </label>

              {/* Pay Button */}
              <Button
                onClick={handlePay}
                isLoading={isProcessing}
                variant="primary"
                size="lg"
                className="w-full mt-2"
              >
                Authorize &amp; Pay £{totalAmount.toFixed(2)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
