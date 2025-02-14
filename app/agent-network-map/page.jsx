"use client";
import React, { useEffect, useRef, useState } from "react";
import TreeGraph from "components/TreeGraph/AgentTreeGraph";
import * as d3 from "d3";
import {
  ShieldCheck,
  ShieldX,
  Users,
  Home,
  UserCheck,
  CalendarCheck,
  Menu,
  X,
} from "lucide-react";
import StarRatings from "react-star-ratings";

const data = {
  name: "Agent A",
  image: "/images/agentA.png",
  role: "agent",
  rating: 4.5,
  verified: true,
  roleSpecificData: 3,
  children: [
    {
      name: "Property Manager 1",
      image: "/images/propertyManager1.png",
      role: "propertyManager",
      rating: 4.2,
      verified: true,
      roleSpecificData: 2,
      children: [
        {
          name: "Client 1",
          image: "/images/client1.png",
          role: "client",
          rating: 3.8,
          verified: false,
          roleSpecificData: 12,
        },
        {
          name: "Client 2",
          image: "/images/client2.png",
          role: "client",
          rating: 4.0,
          verified: true,
          roleSpecificData: 7,
        },
      ],
    },
  ],
};

const AgentNetworkMap = () => {
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select("g");

    const zoom = d3.zoom().on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

    svg.call(zoom);
  }, []);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setIsSidebarOpen(true);
  };

  const legend = [
    { role: "Agent", color: "green" },
    { role: "Property Manager", color: "blue" },
    { role: "Client", color: "orange" },
  ];

  const roleIcons = {
    propertyManager: <Home className="w-5 h-5 text-blue-500" />,
    agent: <UserCheck className="w-5 h-5 text-green-500" />,
    client: <CalendarCheck className="w-5 h-5 text-orange-500" />,
  };

  return (
    <section className="flex flex-col h-screen overflow-hidden min-w-0">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 bg-gray-200 p-4 shadow-md">
        {legend.map(({ role, color }) => (
          <div key={role} className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            ></span>
            <span className="text-sm font-medium">{role}</span>
          </div>
        ))}
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <div
          className={`fixed md:relative w-3/4 md:w-1/4 bg-gray-50 p-6 shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 z-50 md:z-auto h-full`}
        >
          {/* Close Button (X) for Mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full md:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-lg font-semibold text-primary-600 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" /> User Details
          </h3>

          {selectedNode ? (
            <div className="mt-4 space-y-4">
              <img
                src={selectedNode.image}
                alt={selectedNode.name}
                className="w-24 h-24 rounded-full shadow-md border border-gray-200"
              />
              <p className="text-lg font-bold">{selectedNode.name}</p>
              <StarRatings
                rating={selectedNode.rating}
                starRatedColor="#FFD700"
                numberOfStars={5}
                starDimension="20px"
                starSpacing="2px"
              />

              {/* Verification Status */}
              <div className="flex items-center gap-2 text-sm font-medium">
                {selectedNode.verified ? (
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                ) : (
                  <ShieldX className="w-5 h-5 text-gray-400" />
                )}
                <span>{selectedNode.verified ? "Verified" : "Unverified"}</span>
              </div>

              {/* Connection Info */}
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Users className="w-5 h-5 text-blue-500" />
                <span>{selectedNode.children?.length || 0} Connections</span>
              </div>

              {/* Role Specific Data */}
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                {roleIcons[selectedNode.role] || (
                  <Users className="w-5 h-5 text-gray-500" />
                )}
                <span>
                  {selectedNode.roleSpecificData}{" "}
                  {selectedNode.role === "propertyManager"
                    ? "Properties"
                    : selectedNode.role === "agent"
                    ? "Clients"
                    : "Inspections"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mt-4">
              Click on a user to view details
            </p>
          )}
        </div>

        {/* Tree Graph */}
        <div className="flex-1 flex justify-center items-center bg-white overflow-auto relative">
          {!isSidebarOpen && (
            <div className="md:hidden absolute top-4 left-1/2 transform -translate-x-1/2 text-center p-4 bg-gray-100 text-gray-500 shadow-md rounded-lg">
              Click on a user to view details
            </div>
          )}
          <svg
            ref={svgRef}
            className="w-full h-full overflow-visible"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid meet"
          >
            <g transform="translate(50,50)">
              <TreeGraph data={data} onNodeClick={handleNodeClick} />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default AgentNetworkMap;
