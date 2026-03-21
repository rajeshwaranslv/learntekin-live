import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import firebase, { db } from "../../../firebase";

const SERVICES = [
  {
    serviceCategory: "Dharshan Pre-booking",
    serviceId: "LTINS0001",
    packageName: "Sabarimala Pilgrims",
    description: "To book a virtual queue booking",
    chargesPriceInr: 100,
    suggestedTimeline: "30 Mins",
    notes: "To avoid spot booking during Dharshan",
  },
  {
    serviceCategory: "GOVT ID Updation",
    serviceId: "LTINS0002",
    packageName: "Update Aadhar Address",
    description: "To change of address in Aadhar",
    chargesPriceInr: 200,
    suggestedTimeline: "1 Hr",
    notes: "Will update within 2 weeks",
  },
  {
    serviceCategory: "GOVT ID Updation",
    serviceId: "LTINS0003",
    packageName: "Update PAN Name, Address",
    description: "To change of address, Name in PAN",
    chargesPriceInr: 200,
    suggestedTimeline: "1 Hr",
    notes: "Will update within 2 weeks",
  },
  {
    serviceCategory: "Bill Payments",
    serviceId: "LTINS0004",
    packageName: "EB Bills",
    description: "To pay the penalty and bills of EB",
    chargesPriceInr: 100,
    suggestedTimeline: "30 Mins",
    notes: "Will get an update in an hour",
  },
  {
    serviceCategory: "Bill Payments",
    serviceId: "LTINS0005",
    packageName: "Broadband Bills, Police Fines",
    description: "To pay the Broadband Bills, Police Fines",
    chargesPriceInr: 100,
    suggestedTimeline: "30 Mins",
    notes: "Will get an update in an hour",
  },
  {
    serviceCategory: "Toll Recharge",
    serviceId: "LTINS0006",
    packageName: "Annual Toll Pass",
    description: "To pay the ATP",
    chargesPriceInr: 100,
    suggestedTimeline: "30 Mins",
    notes: "Will get an update in an hour",
  },
  {
    serviceCategory: "Toll Recharge",
    serviceId: "LTINS0007",
    packageName: "Toll Recharge",
    description: "To recharge toll wallet",
    chargesPriceInr: 50,
    suggestedTimeline: "10 Mins",
    notes: "Will get an update in an hour",
  },
];

const Eseva = () => {
  const serviceCategories = useMemo(() => {
    return Array.from(new Set(SERVICES.map((item) => item.serviceCategory)));
  }, []);

  const [selectedCategory, setSelectedCategory] = useState(
    serviceCategories[0] || ""
  );

  const packagesForCategory = useMemo(() => {
    return SERVICES.filter(
      (item) => item.serviceCategory === selectedCategory
    );
  }, [selectedCategory]);

  const [selectedPackageId, setSelectedPackageId] = useState(
    packagesForCategory[0]?.serviceId || ""
  );

  const selectedService = useMemo(() => {
    return SERVICES.find((item) => item.serviceId === selectedPackageId) || null;
  }, [selectedPackageId]);

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);

    const nextPackage = SERVICES.find(
      (item) => item.serviceCategory === newCategory
    );
    setSelectedPackageId(nextPackage?.serviceId || "");
  };

  const handlePackageChange = (event) => {
    setSelectedPackageId(event.target.value);
  };

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    email: "",
    address: "",
    requirementDetails: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedService) {
      Swal.fire({
        icon: "warning",
        title: "Select a Package",
        text: "Please choose a package before submitting your request.",
      });
      return;
    }

    setIsSubmitting(true);
    const trackingId = `LTK-${uuidv4().slice(0, 8).toUpperCase()}`;

    const payload = {
      trackingId,
      bookingStatus: "Pending",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      customer: {
        name: formData.customerName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
        requirementDetails: formData.requirementDetails,
      },
      service: {
        category: selectedService.serviceCategory,
        serviceId: selectedService.serviceId,
        packageName: selectedService.packageName,
        description: selectedService.description,
        chargesPriceInr: selectedService.chargesPriceInr,
        suggestedTimeline: selectedService.suggestedTimeline,
        notes: selectedService.notes,
      },
    };

    try {
      await db.collection("esevaBookings").doc(trackingId).set(payload);
      Swal.fire({
        icon: "success",
        title: "Booking Submitted",
        html: `Your tracking ID is <strong>${trackingId}</strong>`,
        confirmButtonText: "Got it",
      });
      setFormData({
        customerName: "",
        phoneNumber: "",
        email: "",
        address: "",
        requirementDetails: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Please try again in a few minutes.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="container-fluid"
      style={{
        padding: "2.5rem 1rem",
        marginTop: "6rem",
        background:
          "linear-gradient(135deg, rgba(240, 248, 255, 0.9), rgba(255, 245, 235, 0.85))",
      }}
    >
      <div
        className="section-title text-center"
        style={{ maxWidth: "1100px", margin: "0 auto" }}
      >
        <h2 style={{ color: "#1b1b1b", fontWeight: "700" }}>eSeva Services</h2>
        <p style={{ fontSize: "18px", color: "#333" }}>
          Select a service category and package, then submit your request in a
          single streamlined form.
        </p>
      </div>

      <div className="container" style={{ maxWidth: "1100px" }}>
        <div
          className="card"
          style={{
            marginTop: "2rem",
            borderRadius: "18px",
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 18px 45px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            className="card-body"
            style={{ padding: "clamp(1.5rem, 3vw, 2.5rem)" }}
          >
          <div className="row g-3">
            <div className="col-lg-6">
              <div
                style={{
                  background: "rgba(27, 27, 27, 0.04)",
                  borderRadius: "14px",
                  padding: "1.5rem",
                }}
              >
                <h5 style={{ color: "#1b1b1b", fontWeight: "600" }}>
                  Choose Service
                </h5>
                <p style={{ color: "#4c4c4c", marginBottom: "1rem" }}>
                  Pick a category to see available packages instantly.
                </p>
                <label
                  htmlFor="eseva-category"
                  style={{ fontWeight: "600", color: "#1b1b1b" }}
                >
                  Service Category
                </label>
                <select
                  id="eseva-category"
                  className="form-control"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  style={{ borderRadius: "10px" }}
                >
                  {serviceCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <label
                  htmlFor="eseva-package"
                  style={{
                    fontWeight: "600",
                    color: "#1b1b1b",
                    marginTop: "1rem",
                  }}
                >
                  Package
                </label>
                <select
                  id="eseva-package"
                  className="form-control"
                  value={selectedPackageId}
                  onChange={handlePackageChange}
                  style={{ borderRadius: "10px" }}
                >
                  {packagesForCategory.map((item) => (
                    <option key={item.serviceId} value={item.serviceId}>
                      {item.packageName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-lg-6">
              {selectedService ? (
                <div
                  style={{
                    background: "linear-gradient(135deg, #fff6ee, #f5fbff)",
                    borderRadius: "14px",
                    padding: "1.5rem",
                  }}
                >
                  <h5 style={{ color: "#1b1b1b", fontWeight: "600" }}>
                    Package Snapshot
                  </h5>
                  <p style={{ color: "#4c4c4c", marginBottom: "1rem" }}>
                    {selectedService.description}
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    <div>
                      <small style={{ color: "#6b6b6b" }}>Service ID</small>
                      <div style={{ fontWeight: "600" }}>
                        {selectedService.serviceId}
                      </div>
                    </div>
                    <div>
                      <small style={{ color: "#6b6b6b" }}>Timeline</small>
                      <div style={{ fontWeight: "600" }}>
                        {selectedService.suggestedTimeline}
                      </div>
                    </div>
                    <div>
                      <small style={{ color: "#6b6b6b" }}>Charges</small>
                      <div style={{ fontWeight: "600" }}>
                        INR {selectedService.chargesPriceInr}
                      </div>
                    </div>
                    <div>
                      <small style={{ color: "#6b6b6b" }}>Notes</small>
                      <div style={{ fontWeight: "600" }}>
                        {selectedService.notes}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: "rgba(0,0,0,0.04)",
                    borderRadius: "14px",
                    padding: "1.5rem",
                    height: "100%",
                  }}
                >
                  <p style={{ color: "#4c4c4c" }}>
                    Please select a package to view details.
                  </p>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
            <div className="row g-3">
              <div className="col-md-4">
                <label
                  htmlFor="customerName"
                  style={{ fontWeight: "600", color: "#1b1b1b" }}
                >
                  Customer Name
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  className="form-control"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label
                  htmlFor="phoneNumber"
                  style={{ fontWeight: "600", color: "#1b1b1b" }}
                >
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  className="form-control"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label
                  htmlFor="email"
                  style={{ fontWeight: "600", color: "#1b1b1b" }}
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="row g-3" style={{ marginTop: "0.5rem" }}>
              <div className="col-md-6">
                <label
                  htmlFor="address"
                  style={{ fontWeight: "600", color: "#1b1b1b" }}
                >
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="form-control"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="requirementDetails"
                  style={{ fontWeight: "600", color: "#1b1b1b" }}
                >
                  Requirement Details
                </label>
                <textarea
                  id="requirementDetails"
                  name="requirementDetails"
                  rows="2"
                  className="form-control"
                  value={formData.requirementDetails}
                  onChange={handleInputChange}
                  placeholder="Briefly describe the requirement (1-2 lines)"
                  required
                />
              </div>
            </div>

            <div
              className="d-flex flex-column flex-md-row align-items-md-center justify-content-between"
              style={{ marginTop: "1.5rem", gap: "1rem" }}
            >
              <div style={{ color: "#4c4c4c" }}>
                Status will be set to <strong>Pending</strong> and updated after
                review.
              </div>
              <button
                type="submit"
                className="gfg-btn eseva-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Booking"}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Eseva;
