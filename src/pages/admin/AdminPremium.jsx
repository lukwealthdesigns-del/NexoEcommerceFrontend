
import React, { useEffect, useMemo, useState } from "react";
import {
  Crown,
  Users,
  DollarSign,
  CreditCard,
  Clock,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  RefreshCw,
  Power,
  PowerOff,
  Tag,
  Zap,
} from "lucide-react";

import adminService from "../../services/admin";

const BUILT_IN_PLANS = ["basic", "standard", "pro"];

const emptyPlan = {
  plan_key: "",
  name: "",
  price: 0,
  duration_days: 30,
  boost_multiplier: 2,
  features: [],
  is_active: true,
};

function normalizePlans(data) {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.plans)) {
    return data.plans;
  }

  if (data?.plans && typeof data.plans === "object") {
    return Object.entries(data.plans).map(([key, value]) => ({
      plan_key: key,
      key,
      ...value,
    }));
  }

  if (data && typeof data === "object") {
    return Object.entries(data)
      .filter(
        ([key, value]) =>
          value &&
          typeof value === "object" &&
          !Array.isArray(value)
      )
      .map(([key, value]) => ({
        plan_key: key,
        key,
        ...value,
      }));
  }

  return [];
}

function normalizeSubscriptions(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.subscriptions)) return data.subscriptions;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

function getPlanKey(plan) {
  return plan?.plan_key || plan?.key || plan?.plan || "";
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong."
  );
}

function formatMoney(value) {
  const amount = Number(value || 0);

  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export default function AdminPremium() {
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState(emptyPlan);

  const [featureInput, setFeatureInput] = useState("");
  const [createFeatureInput, setCreateFeatureInput] = useState("");

  const [activeTab, setActiveTab] = useState("plans");

  const loadData = async () => {
    try {
      setLoading(true);

      const [plansResult, subscriptionsResult, statsResult] =
        await Promise.all([
          adminService.getPremiumPlans(),
          adminService.getAllPremiumSubscriptions(),
          adminService.getPremiumStats(),
        ]);

      setPlans(normalizePlans(plansResult));
      setSubscriptions(normalizeSubscriptions(subscriptionsResult));
      setStats(statsResult || {});
    } catch (error) {
      console.error("Premium loading error:", error);
      window.alert(`Failed to load Premium data.\n\n${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculatedStats = useMemo(() => {
    const activeSubscriptions = subscriptions.filter((item) => {
      const status = String(item?.status || "").toLowerCase();
      return (
        item?.is_active === true ||
        status === "active" ||
        status === "premium"
      );
    });

    const revenueFromSubscriptions = subscriptions.reduce((total, item) => {
      return total + Number(item?.amount || item?.price || 0);
    }, 0);

    return {
      users:
        stats?.premium_users ??
        stats?.premiumUsers ??
        stats?.total_premium_users ??
        activeSubscriptions.length,

      revenue:
        stats?.total_revenue ??
        stats?.totalRevenue ??
        stats?.revenue ??
        revenueFromSubscriptions,

      active:
        stats?.active_subscriptions ??
        stats?.activeSubscriptions ??
        activeSubscriptions.length,

      expiring:
        stats?.expiring_soon ??
        stats?.expiringSoon ??
        0,
    };
  }, [stats, subscriptions]);

  const openEditModal = (plan) => {
    const key = getPlanKey(plan);

    setEditingPlan(plan);

    setPlanForm({
      plan_key: key,
      name: plan?.name || "",
      price: Number(plan?.price || 0),
      duration_days: Number(plan?.duration_days || 30),
      boost_multiplier: Number(plan?.boost_multiplier || 2),
      features: Array.isArray(plan?.features) ? [...plan.features] : [],
      is_active:
        plan?.is_active === undefined ? true : Boolean(plan.is_active),
    });

    setFeatureInput("");
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    if (saving) return;

    setShowEditModal(false);
    setEditingPlan(null);
    setFeatureInput("");
  };

  const handlePlanFormChange = (field, value) => {
    setPlanForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const addFeature = () => {
    const feature = featureInput.trim();

    if (!feature) return;

    setPlanForm((previous) => ({
      ...previous,
      features: [...previous.features, feature],
    }));

    setFeatureInput("");
  };

  const removeFeature = (index) => {
    setPlanForm((previous) => ({
      ...previous,
      features: previous.features.filter((_, i) => i !== index),
    }));
  };

  const handleFeatureKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addFeature();
    }
  };

  const savePlan = async (event) => {
    event.preventDefault();

    if (!editingPlan) return;

    const key = getPlanKey(editingPlan);

    if (!planForm.name.trim()) {
      window.alert("Please enter a plan name.");
      return;
    }

    if (Number(planForm.price) < 0) {
      window.alert("Price cannot be negative.");
      return;
    }

    if (Number(planForm.duration_days) <= 0) {
      window.alert("Duration must be greater than 0.");
      return;
    }

    if (Number(planForm.boost_multiplier) < 1) {
      window.alert("Boost multiplier must be at least 1.");
      return;
    }

    try {
      setSaving(true);

      await adminService.updatePremiumPlan(key, {
        name: planForm.name.trim(),
        price: Number(planForm.price),
        duration_days: Number(planForm.duration_days),
        boost_multiplier: Number(planForm.boost_multiplier),
        features: planForm.features,
        is_active: Boolean(planForm.is_active),
      });

      window.alert("Premium plan updated successfully.");

      closeEditModal();
      await loadData();
    } catch (error) {
      console.error("Update premium plan error:", error);

      window.alert(
        `Failed to update Premium plan.\n\n${getErrorMessage(error)}`
      );
    } finally {
      setSaving(false);
    }
  };

  const openCreateModal = () => {
    setPlanForm({
      ...emptyPlan,
      features: [],
    });

    setCreateFeatureInput("");
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    if (saving) return;

    setShowCreateModal(false);
    setCreateFeatureInput("");
  };

  const addCreateFeature = () => {
    const feature = createFeatureInput.trim();

    if (!feature) return;

    setPlanForm((previous) => ({
      ...previous,
      features: [...previous.features, feature],
    }));

    setCreateFeatureInput("");
  };

  const handleCreateFeatureKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addCreateFeature();
    }
  };

  const createPlan = async (event) => {
    event.preventDefault();

    const key = planForm.plan_key.trim().toLowerCase();

    if (!key) {
      window.alert("Please enter a plan key.");
      return;
    }

    if (!/^[a-z0-9_-]+$/.test(key)) {
      window.alert(
        "Plan key can only contain lowercase letters, numbers, underscores and hyphens."
      );
      return;
    }

    if (!planForm.name.trim()) {
      window.alert("Please enter a plan name.");
      return;
    }

    if (Number(planForm.price) < 0) {
      window.alert("Price cannot be negative.");
      return;
    }

    if (Number(planForm.duration_days) <= 0) {
      window.alert("Duration must be greater than 0.");
      return;
    }

    if (Number(planForm.boost_multiplier) < 1) {
      window.alert("Boost multiplier must be at least 1.");
      return;
    }

    try {
      setSaving(true);

      await adminService.createPremiumPlan({
        plan_key: key,
        name: planForm.name.trim(),
        price: Number(planForm.price),
        duration_days: Number(planForm.duration_days),
        boost_multiplier: Number(planForm.boost_multiplier),
        features: planForm.features,
        is_active: Boolean(planForm.is_active),
      });

      window.alert("Premium plan created successfully.");

      closeCreateModal();
      await loadData();
    } catch (error) {
      console.error("Create premium plan error:", error);

      window.alert(
        `Failed to create Premium plan.\n\n${getErrorMessage(error)}`
      );
    } finally {
      setSaving(false);
    }
  };

  const deletePlan = async (plan) => {
    const key = getPlanKey(plan);

    if (!key) return;

    if (BUILT_IN_PLANS.includes(key.toLowerCase())) {
      window.alert(
        "Basic, Standard and Pro are built-in Premium plans and cannot be deleted."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the "${plan?.name || key}" Premium plan?`
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      await adminService.deletePremiumPlan(key);

      window.alert("Premium plan deleted successfully.");

      await loadData();
    } catch (error) {
      console.error("Delete premium plan error:", error);

      window.alert(
        `Failed to delete Premium plan.\n\n${getErrorMessage(error)}`
      );
    } finally {
      setSaving(false);
    }
  };

  const deactivateSubscription = async (subscription) => {
    const id =
      subscription?.id ||
      subscription?.subscription_id ||
      subscription?.subscriptionId;

    if (!id) {
      window.alert("Subscription ID was not found.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to deactivate this Premium subscription?"
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      await adminService.deactivatePremium(id);

      window.alert("Premium subscription deactivated.");

      await loadData();
    } catch (error) {
      console.error("Deactivate subscription error:", error);

      window.alert(
        `Failed to deactivate subscription.\n\n${getErrorMessage(error)}`
      );
    } finally {
      setSaving(false);
    }
  };

  const renderFeatures = (features) => {
    if (!Array.isArray(features) || features.length === 0) {
      return (
        <span className="text-sm text-gray-400">
          No features added
        </span>
      );
    }

    return (
      <ul className="mt-4 space-y-2">
        {features.map((feature, index) => (
          <li
            key={`${feature}-${index}`}
            className="flex items-start gap-2 text-sm text-gray-600"
          >
            <Check
              size={16}
              className="mt-0.5 shrink-0 text-green-600"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
                <Crown className="text-yellow-600" size={28} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                  Premium Management
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage Premium plans, subscriptions and pricing.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <Plus size={18} />
              Create Plan
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Premium Users"
            value={calculatedStats.users}
            icon={<Users size={23} />}
          />

          <StatCard
            title="Total Revenue"
            value={formatMoney(calculatedStats.revenue)}
            icon={<DollarSign size={23} />}
          />

          <StatCard
            title="Active Subscriptions"
            value={calculatedStats.active}
            icon={<CreditCard size={23} />}
          />

          <StatCard
            title="Expiring Soon"
            value={calculatedStats.expiring}
            icon={<Clock size={23} />}
          />
        </div>

        {/* Boost information */}
        <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex gap-3">
            <div className="mt-0.5">
              <Zap className="text-blue-600" size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-blue-900">
                Boost Multiplier
              </h2>

              <p className="mt-1 text-sm leading-6 text-blue-800">
                The boost multiplier is the visibility factor assigned to a
                Premium plan. For example, a value of <strong>2x</strong>{" "}
                means the plan has a 2x boost value compared with the
                normal baseline. Your listing/search ranking logic must
                actually read this value for it to affect visibility.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex overflow-hidden rounded-lg border border-gray-200 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab("plans")}
            className={`flex-1 px-5 py-3 text-sm font-semibold transition ${
              activeTab === "plans"
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Premium Plans
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("subscriptions")}
            className={`flex-1 px-5 py-3 text-sm font-semibold transition ${
              activeTab === "subscriptions"
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Subscriptions
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-gray-200 bg-white">
            <div className="text-center">
              <RefreshCw
                size={32}
                className="mx-auto animate-spin text-orange-500"
              />
              <p className="mt-3 text-sm text-gray-500">
                Loading Premium data...
              </p>
            </div>
          </div>
        ) : activeTab === "plans" ? (
          <>
            {/* Plans */}
            {plans.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
                <Crown
                  size={42}
                  className="mx-auto text-gray-300"
                />

                <h3 className="mt-4 text-lg font-semibold text-gray-800">
                  No Premium plans found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Create your first Premium plan.
                </p>

                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-5 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  Create Plan
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {plans.map((plan) => {
                  const key = getPlanKey(plan);
                  const isBuiltIn = BUILT_IN_PLANS.includes(
                    key.toLowerCase()
                  );

                  return (
                    <div
                      key={key}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                    >
                      <div className="border-b border-gray-100 bg-gradient-to-r from-orange-50 to-yellow-50 p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="mb-2 flex items-center gap-2">
                              <Crown
                                size={18}
                                className="text-orange-500"
                              />

                              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                {key}
                              </span>
                            </div>

                            <h2 className="text-xl font-bold text-gray-900">
                              {plan?.name || key}
                            </h2>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              plan?.is_active === false
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {plan?.is_active === false
                              ? "Inactive"
                              : "Active"}
                          </span>
                        </div>

                        <div className="mt-5">
                          <span className="text-3xl font-bold text-gray-900">
                            {formatMoney(plan?.price)}
                          </span>

                          <span className="ml-2 text-sm text-gray-500">
                            / {plan?.duration_days || 0} days
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="mb-4 grid grid-cols-2 gap-3">
                          <div className="rounded-lg bg-gray-50 p-3">
                            <p className="text-xs text-gray-500">
                              Duration
                            </p>

                            <p className="mt-1 font-semibold text-gray-900">
                              {plan?.duration_days || 0} days
                            </p>
                          </div>

                          <div className="rounded-lg bg-gray-50 p-3">
                            <p className="text-xs text-gray-500">
                              Boost
                            </p>

                            <p className="mt-1 font-semibold text-orange-600">
                              {Number(
                                plan?.boost_multiplier || 1
                              ).toLocaleString()}
                              x
                            </p>
                          </div>
                        </div>

                        <h3 className="text-sm font-semibold text-gray-900">
                          Features
                        </h3>

                        {renderFeatures(plan?.features)}

                        <div className="mt-6 flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(plan)}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                          >
                            <Pencil size={16} />
                            Edit
                          </button>

                          {!isBuiltIn && (
                            <button
                              type="button"
                              onClick={() => deletePlan(plan)}
                              className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2.5 text-red-600 hover:bg-red-50"
                              title="Delete plan"
                            >
                              <Trash2 size={17} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* Subscriptions */
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900">
                Premium Subscriptions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage active Premium subscriptions.
              </p>
            </div>

            {subscriptions.length === 0 ? (
              <div className="p-10 text-center text-sm text-gray-500">
                No Premium subscriptions found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        User
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Plan
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Amount
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Expiry
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {subscriptions.map((subscription, index) => {
                      const id =
                        subscription?.id ||
                        subscription?.subscription_id ||
                        subscription?.subscriptionId ||
                        index;

                      const userName =
                        subscription?.user_name ||
                        subscription?.username ||
                        subscription?.name ||
                        subscription?.email ||
                        "Unknown user";

                      const planName =
                        subscription?.plan_name ||
                        subscription?.plan ||
                        subscription?.plan_key ||
                        "Premium";

                      const status =
                        subscription?.status ||
                        (subscription?.is_active
                          ? "active"
                          : "inactive");

                      const expiry =
                        subscription?.expires_at ||
                        subscription?.expiry_date ||
                        subscription?.end_date ||
                        subscription?.expires ||
                        "-";

                      return (
                        <tr
                          key={id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-5 py-4">
                            <div className="font-medium text-gray-900">
                              {userName}
                            </div>

                            {subscription?.email &&
                              subscription.email !== userName && (
                                <div className="mt-0.5 text-xs text-gray-500">
                                  {subscription.email}
                                </div>
                              )}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-700">
                            {planName}
                          </td>

                          <td className="px-5 py-4 text-sm font-medium text-gray-900">
                            {formatMoney(
                              subscription?.amount ||
                                subscription?.price ||
                                0
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                String(status).toLowerCase() ===
                                  "active" ||
                                subscription?.is_active === true
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {String(status)}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {expiry !== "-"
                              ? new Date(expiry).toLocaleDateString(
                                  "en-NG"
                                )
                              : "-"}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                deactivateSubscription(
                                  subscription
                                )
                              }
                              disabled={saving}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              <PowerOff size={14} />
                              Deactivate
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* EDIT PLAN MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Premium Plan
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update the Premium plan settings.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={savePlan}
              className="space-y-5 p-6"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Plan Key
                </label>

                <input
                  value={planForm.plan_key}
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-sm text-gray-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Plan Name
                </label>

                <input
                  value={planForm.name}
                  onChange={(event) =>
                    handlePlanFormChange(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Premium Pro"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Price (₦)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={planForm.price}
                    onChange={(event) =>
                      handlePlanFormChange(
                        "price",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Duration
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={planForm.duration_days}
                    onChange={(event) =>
                      handlePlanFormChange(
                        "duration_days",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Days
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Boost Multiplier
                  </label>

                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    value={planForm.boost_multiplier}
                    onChange={(event) =>
                      handlePlanFormChange(
                        "boost_multiplier",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Example: 2 = 2x
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Features
                </label>

                <div className="flex gap-2">
                  <input
                    value={featureInput}
                    onChange={(event) =>
                      setFeatureInput(event.target.value)
                    }
                    onKeyDown={handleFeatureKeyDown}
                    placeholder="Type a feature and press Enter"
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />

                  <button
                    type="button"
                    onClick={addFeature}
                    className="rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {planForm.features.map((feature, index) => (
                    <div
                      key={`${feature}-${index}`}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                    >
                      <span className="text-sm text-gray-700">
                        {feature}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Plan Active
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Allow customers to use this plan.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={Boolean(planForm.is_active)}
                  onChange={(event) =>
                    handlePlanFormChange(
                      "is_active",
                      event.target.checked
                    )
                  }
                  className="h-5 w-5 accent-orange-500"
                />
              </label>

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Check size={17} />
                  )}

                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PLAN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Create Premium Plan
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add a new Premium subscription plan.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                disabled={saving}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={createPlan}
              className="space-y-5 p-6"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Plan Key
                </label>

                <input
                  value={planForm.plan_key}
                  onChange={(event) =>
                    handlePlanFormChange(
                      "plan_key",
                      event.target.value
                    )
                  }
                  placeholder="e.g. gold"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Use lowercase letters, numbers, - or _.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Plan Name
                </label>

                <input
                  value={planForm.name}
                  onChange={(event) =>
                    handlePlanFormChange(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Gold Premium"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Price (₦)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={planForm.price}
                    onChange={(event) =>
                      handlePlanFormChange(
                        "price",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Duration
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={planForm.duration_days}
                    onChange={(event) =>
                      handlePlanFormChange(
                        "duration_days",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Boost Multiplier
                  </label>

                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    value={planForm.boost_multiplier}
                    onChange={(event) =>
                      handlePlanFormChange(
                        "boost_multiplier",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Features
                </label>

                <div className="flex gap-2">
                  <input
                    value={createFeatureInput}
                    onChange={(event) =>
                      setCreateFeatureInput(event.target.value)
                    }
                    onKeyDown={handleCreateFeatureKeyDown}
                    placeholder="Type a feature and press Enter"
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />

                  <button
                    type="button"
                    onClick={addCreateFeature}
                    className="rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {planForm.features.map((feature, index) => (
                    <div
                      key={`${feature}-${index}`}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                    >
                      <span className="text-sm text-gray-700">
                        {feature}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setPlanForm((previous) => ({
                            ...previous,
                            features: previous.features.filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                        className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Plan Active
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Make this plan available to customers.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={Boolean(planForm.is_active)}
                  onChange={(event) =>
                    handlePlanFormChange(
                      "is_active",
                      event.target.checked
                    )
                  }
                  className="h-5 w-5 accent-orange-500"
                />
              </label>

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Plus size={17} />
                  )}

                  {saving ? "Creating..." : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
          {icon}
        </div>
      </div>
    </div>
  );
}
