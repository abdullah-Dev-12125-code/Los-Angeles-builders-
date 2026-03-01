import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Building2,
  Home,
  MapPin,
  Phone,
  DollarSign,
  Users,
  Edit2,
  Trash2,
  ChevronDown,
  Check,
  X,
} from "lucide-react";

interface Unit {
  id: string;
  number: string;
  type: "rent" | "sell";
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  price: number;
  occupancy: "occupied" | "vacant" | "maintenance";
  tenant?: string;
}

interface Building {
  id: string;
  name: string;
  address: string;
  phone: string;
  units: Unit[];
  totalUnits: number;
  occupancyRate: number;
  revenue: number;
}

const initialBuildings: Building[] = [
  {
    id: "b-1",
    name: "Sunset Plaza",
    address: "1234 Sunset Blvd, Los Angeles, CA",
    phone: "+1 (555) 987-6543",
    units: [
      {
        id: "u-1",
        number: "101",
        type: "rent",
        bedrooms: 2,
        bathrooms: 1,
        sqft: 850,
        price: 2500,
        occupancy: "occupied",
        tenant: "Alex Johnson",
      },
      {
        id: "u-2",
        number: "102",
        type: "sell",
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1200,
        price: 750000,
        occupancy: "vacant",
      },
    ],
    totalUnits: 2,
    occupancyRate: 50,
    revenue: 2500,
  },
];

export default function ManageBuildings() {
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNewBuildingForm, setShowNewBuildingForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState<{ buildingId: string; unitId: string } | null>(null);
  const [newBuilding, setNewBuilding] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [newUnit, setNewUnit] = useState({
    number: "",
    type: "rent" as "rent" | "sell",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 500,
    price: 1000,
  });

  // Add building
  const handleAddBuilding = useCallback(() => {
    if (newBuilding.name && newBuilding.address) {
      const building: Building = {
        id: `b-${Date.now()}`,
        name: newBuilding.name,
        address: newBuilding.address,
        phone: newBuilding.phone,
        units: [],
        totalUnits: 0,
        occupancyRate: 0,
        revenue: 0,
      };
      setBuildings([...buildings, building]);
      setNewBuilding({ name: "", address: "", phone: "" });
      setShowNewBuildingForm(false);
    }
  }, [buildings, newBuilding]);

  // Add unit to building
  const handleAddUnit = useCallback(
    (buildingId: string) => {
      if (newUnit.number) {
        setBuildings(
          buildings.map((b) => {
            if (b.id === buildingId) {
              const unit: Unit = {
                id: `u-${Date.now()}`,
                number: newUnit.number,
                type: newUnit.type,
                bedrooms: newUnit.bedrooms,
                bathrooms: newUnit.bathrooms,
                sqft: newUnit.sqft,
                price: newUnit.price,
                occupancy: "vacant",
              };
              return {
                ...b,
                units: [...b.units, unit],
                totalUnits: b.units.length + 1,
              };
            }
            return b;
          })
        );
        setNewUnit({
          number: "",
          type: "rent",
          bedrooms: 1,
          bathrooms: 1,
          sqft: 500,
          price: 1000,
        });
      }
    },
    [buildings, newUnit]
  );

  // Delete unit
  const handleDeleteUnit = useCallback(
    (buildingId: string, unitId: string) => {
      setBuildings(
        buildings.map((b) => {
          if (b.id === buildingId) {
            return {
              ...b,
              units: b.units.filter((u) => u.id !== unitId),
              totalUnits: b.units.length - 1,
            };
          }
          return b;
        })
      );
    },
    [buildings]
  );

  // Delete building
  const handleDeleteBuilding = useCallback(
    (buildingId: string) => {
      setBuildings(buildings.filter((b) => b.id !== buildingId));
    },
    [buildings]
  );

  // Update unit occupancy
  const handleUpdateOccupancy = useCallback(
    (buildingId: string, unitId: string, occupancy: "occupied" | "vacant" | "maintenance") => {
      setBuildings(
        buildings.map((b) => {
          if (b.id === buildingId) {
            const updatedUnits = b.units.map((u) =>
              u.id === unitId ? { ...u, occupancy } : u
            );
            const occupiedCount = updatedUnits.filter((u) => u.occupancy === "occupied").length;
            return {
              ...b,
              units: updatedUnits,
              occupancyRate: Math.round((occupiedCount / updatedUnits.length) * 100) || 0,
            };
          }
          return b;
        })
      );
    },
    [buildings]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Buildings</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewBuildingForm(!showNewBuildingForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Building
        </motion.button>
      </motion.div>

      {/* New Building Form */}
      <AnimatePresence>
        {showNewBuildingForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            variants={itemVariants}
            className="card-glass rounded-2xl p-6 border border-indigo-200/50"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add New Building</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Building Name"
                value={newBuilding.name}
                onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Address"
                value={newBuilding.address}
                onChange={(e) => setNewBuilding({ ...newBuilding, address: e.target.value })}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newBuilding.phone}
                onChange={(e) => setNewBuilding({ ...newBuilding, phone: e.target.value })}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddBuilding}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
              >
                <Check className="w-4 h-4" />
                Create
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewBuildingForm(false)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg font-medium"
              >
                <X className="w-4 h-4" />
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buildings List */}
      <div className="space-y-4">
        {buildings.map((building) => (
          <motion.div
            key={building.id}
            variants={itemVariants}
            className="card-glass rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
          >
            {/* Building Header */}
            <motion.button
              onClick={() => setExpandedId(expandedId === building.id ? null : building.id)}
              className="w-full p-6 flex items-start justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
            >
              <div className="flex items-start gap-4 text-left flex-1">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{building.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4" />
                    {building.address}
                  </p>
                  <div className="flex gap-6 mt-3">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Total Units</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {building.totalUnits}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Occupancy</p>
                      <p className="text-lg font-bold text-emerald-600">{building.occupancyRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Monthly Revenue</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        ${building.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <motion.div animate={{ rotate: expandedId === building.id ? 180 : 0 }}>
                <ChevronDown className="w-5 h-5 text-slate-500" />
              </motion.div>
            </motion.button>

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedId === building.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-slate-200 dark:border-slate-700 p-6 bg-slate-50/50 dark:bg-slate-800/30"
                >
                  {/* Add Unit Form */}
                  <div className="mb-6 p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4">Add Unit</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Unit #"
                        value={newUnit.number}
                        onChange={(e) => setNewUnit({ ...newUnit, number: e.target.value })}
                        className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <select
                        value={newUnit.type}
                        onChange={(e) =>
                          setNewUnit({ ...newUnit, type: e.target.value as "rent" | "sell" })
                        }
                        className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="rent">For Rent</option>
                        <option value="sell">For Sale</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Price"
                        value={newUnit.price}
                        onChange={(e) => setNewUnit({ ...newUnit, price: Number(e.target.value) })}
                        className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <input
                        type="number"
                        placeholder="Beds"
                        value={newUnit.bedrooms}
                        onChange={(e) => setNewUnit({ ...newUnit, bedrooms: Number(e.target.value) })}
                        className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="number"
                        placeholder="Baths"
                        value={newUnit.bathrooms}
                        onChange={(e) => setNewUnit({ ...newUnit, bathrooms: Number(e.target.value) })}
                        className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="number"
                        placeholder="Sqft"
                        value={newUnit.sqft}
                        onChange={(e) => setNewUnit({ ...newUnit, sqft: Number(e.target.value) })}
                        className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => handleAddUnit(building.id)}
                        className="px-3 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
                      >
                        <Plus className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>

                  {/* Units List */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-3">Units</h4>
                    {building.units.length === 0 ? (
                      <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-4">
                        No units added yet
                      </p>
                    ) : (
                      building.units.map((unit) => (
                        <div
                          key={unit.id}
                          className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <Home className="w-4 h-4 text-indigo-600" />
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                  Unit {unit.number} • {unit.bedrooms}bd {unit.bathrooms}ba • {unit.sqft} sqft
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                  {unit.type === "rent" ? `$${unit.price}/mo` : `$${unit.price.toLocaleString()}`} •{" "}
                                  <span
                                    className={`font-semibold ${
                                      unit.occupancy === "occupied"
                                        ? "text-emerald-600"
                                        : unit.occupancy === "vacant"
                                          ? "text-amber-600"
                                          : "text-slate-600"
                                    }`}
                                  >
                                    {unit.occupancy.charAt(0).toUpperCase() + unit.occupancy.slice(1)}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={unit.occupancy}
                              onChange={(e) =>
                                handleUpdateOccupancy(
                                  building.id,
                                  unit.id,
                                  e.target.value as "occupied" | "vacant" | "maintenance"
                                )
                              }
                              className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="occupied">Occupied</option>
                              <option value="vacant">Vacant</option>
                              <option value="maintenance">Maintenance</option>
                            </select>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteUnit(building.id, unit.id)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-red-600 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Building Actions */}
                  <div className="mt-6 flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteBuilding(building.id)}
                      className="flex items-center gap-2 px-4 py-2 border border-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 rounded-lg font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Building
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
