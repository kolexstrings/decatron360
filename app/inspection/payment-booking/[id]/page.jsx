"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Spinner from "components/ui/Spinner";
import { useSnackbar } from "notistack";
import { formatCurrency } from "@/utils/helpers/formatCurrency";
import { formatTime } from "@/utils/helpers/formatTime";
import { PaystackButton } from "react-paystack";
import { fetchUserData } from "@/utils/api/user/fetchUserData";
import { fetchPropertyData } from "@/utils/api/properties/fetchPropertyData";
import { bookInspection } from "@/utils/api/inspection/bookInspection";
import { referralBookInspection } from "utils/api/inspection/referralBookInspection";
import { scheduleBooked } from "utils/api/scheduler/scheduleBooked";

const PaymentInspectionBooking = () => {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { id: propertyId } = useParams();
  const [user, setUser] = useState(null);
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inspectionData, setInspectionData] = useState(null);
  const [isInspectionConfirmed, setIsInspectionConfirmed] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDate, setEditedDate] = useState("");
  const [editedTime, setEditedTime] = useState("");

  // Fetch user and property data when component mounts
  useEffect(() => {
    const fetchUserAndPropertyData = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        return;
      }

      try {
        const userResponse = await fetchUserData(userId);
        setUser(userResponse);

        const propertyResponse = await fetchPropertyData(propertyId);

        // Convert the inspection fee from string to number
        const sanitizedInspectionFee = parseFloat(
          propertyResponse.data.inspectionFee.replace(/[^0-9.]/g, "")
        );

        setProperty({
          ...propertyResponse,
          data: {
            ...propertyResponse.data,
            inspectionFee: sanitizedInspectionFee,
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndPropertyData();
  }, [propertyId]);

  // Set initial date and time values from session storage
  useEffect(() => {
    const savedDate = sessionStorage.getItem("inspectionDate");
    const savedTime = sessionStorage.getItem("inspectionTime");

    if (savedDate) setEditedDate(savedDate);
    if (savedTime) setEditedTime(savedTime);
  }, []);

  // Save edited data to state
  const handleSave = () => {
    setInspectionData({
      ...inspectionData,
      date: editedDate,
      time: editedTime,
    });
    setIsEditing(false);
  };

  const validateBookingData = (
    userId,
    propertyId,
    agentId,
    bookingDateTime
  ) => {
    if (!userId) {
      return false;
    }
    if (!propertyId) {
      return false;
    }
    if (!agentId) {
      return false;
    }
    if (!bookingDateTime) {
      return false;
    }
    return true;
  };

  const validateReferralBookingData = (
    userId,
    propertyId,
    referralCode,
    bookingDateTime
  ) => {
    if (!userId) {
      return false;
    }
    if (!propertyId) {
      return false;
    }
    if (!referralCode) {
      return false;
    }
    if (!bookingDateTime) {
      return false;
    }
    return true;
  };

  const handleBookInspection = async () => {
    const userId = sessionStorage.getItem("userId");
    const agentId = sessionStorage.getItem("agentId");
    const bookingDateTime = new Date(
      `${editedDate}T${editedTime}:00`
    ).toISOString();

    const isValid = validateBookingData(
      userId,
      propertyId,
      agentId,
      bookingDateTime
    );
    if (!isValid) return;

    try {
      const bookingId = await bookInspection(
        userId,
        propertyId,
        agentId,
        bookingDateTime
      );
      return bookingId;
    } catch (error) {
      console.error("Failed to book inspection", error);
      throw new Error("Booking failed");
    }
  };

  const handleReferaralBookInspection = async () => {
    const userId = sessionStorage.getItem("userId");
    const referralCode = sessionStorage.getItem("referralCode");
    const bookingDateTime = new Date(
      `${editedDate}T${editedTime}:00`
    ).toISOString();

    const isValid = validateReferralBookingData(
      userId,
      propertyId,
      referralCode,
      bookingDateTime
    );
    if (!isValid) return;

    try {
      const bookingId = await referralBookInspection(
        userId,
        propertyId,
        referralCode,
        bookingDateTime
      );
      return bookingId;
    } catch (error) {
      console.error("Failed to book inspection", error);
      throw new Error("Booking failed");
    }
  };

  const handleBookedSlot = async () => {
    const bookedSlotId = sessionStorage.getItem("bookedSlotId");
    try {
      await scheduleBooked(bookedSlotId);
    } catch (error) {
      console.error(
        "Failed to schedule book inspection on agent calender: ",
        error
      );
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const referralCode = sessionStorage.getItem("referralCode");

      if (referralCode) {
        await handleReferaralBookInspection();
        enqueueSnackbar("Inspection successfully booked with your referrer!", {
          variant: "success",
        });
      } else {
        await handleBookInspection();
        enqueueSnackbar(
          "Inspection successfully booked with the lister of this property!",
          { variant: "success" }
        );
      }
      await handleBookedSlot();
      router.push("/inspection/success");
    } catch (error) {
      enqueueSnackbar("Failed to book inspection after payment", {
        variant: "error",
      });
    }
  };
  const {
    inspectionFee = 0,
    propertyTitle,
    state,
    lga,
    neighbourhood,
  } = property
    ? {
        inspectionFee: property.data.inspectionFee,
        propertyTitle: property.data.title,
        state: property.data.state,
        lga: property.data.lga,
        neighbourhood: property.data.neighbourhood,
      }
    : {};

  const serviceCharge = inspectionFee ? inspectionFee * 0.15 : 1500;

  const componentProps = {
    email: user?.email,
    amount: (inspectionFee + serviceCharge) * 100,
    metadata: {
      name: user?.name,
      phone: user?.phone,
    },
    publicKey,
    text: "Confirm and Pay",
    onSuccess: handlePaymentSuccess,
    onClose: () =>
      enqueueSnackbar("You cancelled your inspection booking.", {
        variant: "warning",
      }),
  };

  if (!user || isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Booking Summary</h1>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{propertyTitle}</h2>
            <p className="text-gray-700 mb-2">
              Location: {neighbourhood}, {lga}, {state}
            </p>
            <div className="text-gray-700">
              <p>
                Inspection Date:{" "}
                {isEditing ? (
                  <input
                    type="date"
                    value={editedDate}
                    onChange={(e) => setEditedDate(e.target.value)}
                    className="border rounded-md p-2 w-full"
                  />
                ) : (
                  editedDate || "Loading..."
                )}
              </p>
              <p>
                Inspection Time:{" "}
                {isEditing ? (
                  <input
                    type="time"
                    value={editedTime}
                    onChange={(e) => setEditedTime(e.target.value)}
                    className="border rounded-md p-2 w-full"
                  />
                ) : (
                  formatTime(editedTime) || "Loading..."
                )}
              </p>
            </div>
            {isEditing ? (
              <button onClick={handleSave} className="mt-2 text-blue-600">
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 text-blue-600"
              >
                Edit
              </button>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Price Breakdown</h2>
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Inspection Fee</span>
              <span className="font-bold">{formatCurrency(inspectionFee)}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Service Charge</span>
              <span className="font-bold">{formatCurrency(serviceCharge)}</span>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatCurrency(inspectionFee + serviceCharge)}</span>
            </div>
          </div>

          {/* Confirmation Checkboxes */}
          <div className="mb-8">
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={isInspectionConfirmed}
                onChange={() =>
                  setIsInspectionConfirmed(!isInspectionConfirmed)
                }
                className="mr-2 w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-400 border-gray-300 rounded"
              />
              <span className="text-gray-700">
                I confirm the inspection details.
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isTermsAccepted}
                onChange={() => setIsTermsAccepted(!isTermsAccepted)}
                className="mr-2 w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-400 border-gray-300 rounded"
              />
              <span className="text-gray-700">
                I agree to the Terms and Conditions.
              </span>
            </label>
          </div>

          {/* Paystack Payment Button */}
          <PaystackButton
            {...componentProps}
            disabled={!isTermsAccepted || !isInspectionConfirmed}
            className={`w-full py-3 px-4 text-white rounded-lg ${
              !isTermsAccepted || !isInspectionConfirmed
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-700"
            }`}
          />
        </div>
      </div>
      )
    </>
  );
};

export default PaymentInspectionBooking;
