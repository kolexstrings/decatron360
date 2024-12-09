"use client";
import PropertyCard from "./Properties/PropertyCard";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Spinner from "./Spinner";
import { fetchProperties } from "@/utils/api/properties/fetchProperties";
import { addFavoriteProperties } from "utils/api/properties/addFavoriteProperties";

const HomeProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleFetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchProperties();
      console.log("Properties fetched:", res);
      setProperties(res);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetchProperties();
  }, [handleFetchProperties]);

  const handleToggleFavorite = async (propertyId) => {
    console.log("Toggling favorite for:", propertyId);
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found.");
      return;
    }
    try {
      const res = await addFavoriteProperties(userId, propertyId);
      console.log("favorite res: ", res.responseCode);
      if (res.responseCode === 201) {
        setProperties((prevProperties) =>
          prevProperties.map((property) =>
            property._id === propertyId
              ? { ...property, isFavorite: !property.isFavorite }
              : property
          )
        );
      } else {
        console.error("Failed to toggle favorite status.");
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  const recentProperties = properties
    ?.sort(() => Math.random() - Math.random())
    .slice(0, 16);

  return (
    <>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-primary-500 mb-4 text-center">
            Latest Properties
          </h2>
          {loading ? (
            <div className="flex justify-center items-center py-2">
              <Spinner />
            </div>
          ) : recentProperties.length === 0 ? (
            <p className="text-center">No Properties Found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProperties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  isFavorite={property.isFavorite}
                  onToggleFavorite={() => handleToggleFavorite(property._id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {!loading && (
        <section className="m-auto max-w-lg my-10 px-6">
          <Link
            href="/properties"
            className="block bg-primary-500 text-white text-center py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-primary-600"
          >
            See All Properties
          </Link>
        </section>
      )}
    </>
  );
};

export default HomeProperties;
