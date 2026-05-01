const express = require("express");
const { db } = require("../firebase");

const router = express.Router();

// POST /api/patient/register
router.post("/register", async (req, res) => {
  try {
    const docRef = await db.collection("patients").add({
      ...req.body,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      patientId: docRef.id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all patients
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("patients").get();
    const patients = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(patients);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// GET patient by ID
router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection("patients").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient" });
  }
});

// AI MATCHING ROUTE (ONLY ONE)
router.post("/match", async (req, res) => {
  const { descriptor } = req.body;

  if (!descriptor) {
    return res.status(400).json({ message: "No descriptor provided" });
  }

  try {
    const snapshot = await db.collection("patients").get();

    let bestMatch = null;
    let minDistance = 0.6;

    snapshot.forEach(doc => {
      const patient = doc.data();
      if (!patient.faceDescriptor) return;

      const stored = patient.faceDescriptor;
      const scanned = descriptor;

      let sum = 0;
      for (let i = 0; i < stored.length; i++) {
        sum += Math.pow(stored[i] - scanned[i], 2);
      }

      const distance = Math.sqrt(sum);

      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = { id: doc.id, ...patient };
      }
    });

    if (bestMatch) {
      res.json({ matchFound: true, patient: bestMatch });
    } else {
      res.json({ matchFound: false });
    }

  } catch (error) {
    res.status(500).json({ message: "Matching failed" });
  }
});

module.exports = router;