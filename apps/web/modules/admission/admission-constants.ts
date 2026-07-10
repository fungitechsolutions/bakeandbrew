import { BookOpen, CheckCircle2, User, Users } from "lucide-react";

export const ADMISSION_STEPS = ["Personal", "Guardian", "Course", "Review"] as const;

export const ADMISSION_STEP_META = [
  {
    label: "Personal",
    title: "Tell us about you",
    description:
      "Your name, contact details, and a photo help us prepare your student record.",
    hint: "Details & photo",
    icon: User,
  },
  {
    label: "Guardian",
    title: "Emergency contact",
    description:
      "Someone we can reach quickly if we need to get in touch about your application.",
    hint: "Guardian info",
    icon: Users,
  },
  {
    label: "Course",
    title: "Choose your program",
    description:
      "Pick the courses you want to join, your preferred shift, and how you found us.",
    hint: "Program & schedule",
    icon: BookOpen,
  },
  {
    label: "Review",
    title: "Ready to submit?",
    description:
      "Take a moment to review everything. You can still go back and edit any step.",
    hint: "Confirm & send",
    icon: CheckCircle2,
  },
] as const;
