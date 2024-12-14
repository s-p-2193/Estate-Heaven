import React, { useEffect, useState } from 'react';
import '../../styles/Dashboard/Premium.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Premium: React.FC = () => {
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user ? user.id : null; // Extract the user id

  useEffect(() => {
    const fetchUserPremiumStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_API_URL}/api/dashboard/checkpremium/${userId}`);
        const userDetails = await response.json();

        if (userDetails.isPremium) {
          setIsPremiumUser(true);
          setExpiryDate(new Date(userDetails.premiumEndDate)); // Set expiry date from user details
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error('Failed to fetch user details.');
      }
    };

    fetchUserPremiumStatus();
  }, [userId]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (amount: number, plan: string) => {
    const res = await loadRazorpayScript();

    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_SERVER_API_URL}/api/dashboard/premium/payment/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, planType: plan.toLowerCase(), userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error || 'Payment order creation failed.');
      return;
    }

    const { id: order_id } = data;

    const options = {
      key: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay test key
      amount: amount * 100,
      currency: 'INR',
      name: 'Estate Heaven',
      description: `Payment for ${plan} Plan`,
      image: 'https://estate-heaven.onrender.com/favicon.ico',
      order_id: order_id,
      handler: function (response: any) {
        alert(`Payment Successful. Payment ID: ${response.razorpay_payment_id}`);
        setIsPremiumUser(true);
        const newExpiryDate = new Date();
        if (plan === 'Monthly') {
          newExpiryDate.setMonth(newExpiryDate.getMonth() + 1);
        } else {
          newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
        }
        setExpiryDate(newExpiryDate);
      },
      prefill: {
        name: user?.name || '', // Use actual user data if available
        email: user?.email || '', // Use actual user data if available
        contact: user?.phone || '', // Use actual user data if available
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="premium-container">
      <div className="premium-header">
        <h2>{isPremiumUser ? 'Your Premium Membership' : 'Unlock Premium'}</h2>
        {isPremiumUser && expiryDate && (
          <h3>Expires on: {expiryDate.toLocaleDateString('en-GB')}</h3>
        )}
      </div>

      <div className="premium-plans">
        <div className="premium-card monthly">
          <div className="plan-header">
            <h3>Monthly Plan</h3>
            <p className="premium-price">₹50 / month</p>
          </div>
          <ul className="benefits-list">
            <li>Enhanced Visibility</li>
            <li>Top Search Ranking</li>
            <li>40% Traffic Boost</li>
            <li>+30% Buyer Engagement</li>
          </ul>
          <button
            className="subscribe-button"
            onClick={() => handlePayment(50, 'Monthly')}
          >
            Choose Monthly
          </button>
        </div>

        <div className="premium-card yearly">
          <div className="plan-header">
            <h3>Yearly Plan</h3>
            <p className="premium-price">₹500 / year</p>
          </div>
          <ul className="benefits-list">
            <li>Enhanced Visibility</li>
            <li>Top Search Ranking</li>
            <li>40% Traffic Boost</li>
            <li>+30% Buyer Engagement</li>
          </ul>
          <button
            className="subscribe-button"
            onClick={() => handlePayment(500, 'Yearly')}
          >
            Choose Yearly
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Premium;
