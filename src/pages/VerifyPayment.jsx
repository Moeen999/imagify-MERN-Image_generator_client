import React, { useContext, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const planId = searchParams.get("planId");
  const { token, backendUrl, getUserCredits } = useContext(AppContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      if (!token) return;

      const { data } = await axios.post(
        backendUrl + "/api/payment/verify-payment",
        { success, planId },
        { headers: { token } },
      );

      if (data.success) {
        navigate("/");
        toast.success(data.message);
        await getUserCredits();
      } else {
        toast.error(data.message);
        navigate("/buy");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium">
        Verifying your payment, please wait...
      </p>
    </div>
  );
};

export default VerifyPayment;
