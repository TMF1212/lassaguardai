import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Info, MapPin, Phone, ArrowRight, ArrowLeft } from "lucide-react";

interface Question {
  id: string;
  text: string;
  icon: string;
  options: { label: string; value: number }[];
}

const questions: Question[] = [
  {
    id: "fever",
    text: "Do you have a fever (temperature above 38°C/100.4°F)?",
    icon: "🌡️",
    options: [
      { label: "No", value: 0 },
      { label: "Mild fever", value: 1 },
      { label: "High fever", value: 2 },
    ],
  },
  {
    id: "headache",
    text: "Are you experiencing severe headache?",
    icon: "🤕",
    options: [
      { label: "No", value: 0 },
      { label: "Mild", value: 1 },
      { label: "Severe", value: 2 },
    ],
  },
  {
    id: "bleeding",
    text: "Any unusual bleeding (gums, nose, eyes)?",
    icon: "🩸",
    options: [
      { label: "No", value: 0 },
      { label: "Minor", value: 2 },
      { label: "Significant", value: 4 },
    ],
  },
  {
    id: "contact",
    text: "Have you had contact with someone diagnosed with Lassa fever?",
    icon: "👥",
    options: [
      { label: "No", value: 0 },
      { label: "Unsure", value: 1 },
      { label: "Yes", value: 3