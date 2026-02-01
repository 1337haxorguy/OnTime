const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

const SYSTEM_PROMPT = `You are a productivity planning assistant. Given a user's goals, skill level, timeframe, and availability, generate a structured daily task plan.

Rules:
- Only schedule tasks during the user's available time slots.
- Respect blocked dates — never schedule anything on them.
- Start with easier tasks and gradually increase difficulty as the timeframe progresses.
- Each task must fit within a single available time slot (do not span across slots).
- Keep task descriptions actionable and specific.
- If regenerating a single day, keep the rest of the plan consistent.
- Return ONLY valid JSON matching the output schema, no extra text.`;

const OUTPUT_SCHEMA = {
  type: "json_schema",
  json_schema: {
    name: "task_plan",
    strict: true,
    schema: {
      type: "object",
      properties: {
        plan: {
          type: "array",
          items: {
            type: "object",
            properties: {
              goal_id: { type: "string" },
              date: { type: "string" },
              start_time: { type: "string" },
              end_time: { type: "string" },
              title: { type: "string" },
              description: { type: "string" },
              difficulty: { type: "string", enum: ["easy", "moderate", "challenging"] },
              estimated_duration_minutes: { type: "number" },
            },
            required: [
              "goal_id",
              "date",
              "start_time",
              "end_time",
              "title",
              "description",
              "difficulty",
              "estimated_duration_minutes",
            ],
            additionalProperties: false,
          },
        },
      },
      required: ["plan"],
      additionalProperties: false,
    },
  },
};

router.post("/", async (req, res) => {
  const { user_profile, generation_request, existing_plan } = req.body;

  if (!user_profile || !generation_request) {
    return res.status(400).json({ error: "user_profile and generation_request are required." });
  }

  const userMessage = JSON.stringify({ user_profile, generation_request, existing_plan: existing_plan || [] });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: OUTPUT_SCHEMA,
    });

    const plan = JSON.parse(completion.choices[0].message.content);
    res.json(plan);
  } catch (err) {
    console.error("OpenAI API error:", err.message);
    res.status(500).json({ error: "Failed to generate plan." });
  }
});

module.exports = router;
