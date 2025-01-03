import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
});
const systemPrompt = `You are an AI assistant specialized in testing and test automation 
and you are tasked to generate one manual test script based on the process driven requirements testing methodology. Use formal language.`

const reqPrompt = `
Generate at least 1 happy flow, one edge case and one negative case. 
Describe test steps clearly. Include preconditions formulated accoriding to the SMART method, test data, expected results and pass/fail criteria. 
Structure the test case for readibility. Reply in JSON format.  
`
export const claudeApi = async (userPrompt: string, model: { name: string; max_tokens: number }) => {
    const msg = await anthropic.messages.create({
        model: model.name,
        max_tokens: model.max_tokens,
        system: [{
            type: "text",
            text: systemPrompt,
        },
        {
            type: "text",
            text: reqPrompt,
        }],
        tools: [{
            name: "get_test_cases",
            description: "Generate one manual test script from given test scenario",
            input_schema: {
                type: "object",
                properties: {
                    test_case: { type: "string", description: "Test script name" },
                    objective: { type: "string", description: "Objective of the test script" },
                    preconditions: {
                        type: "array",
                        items: { type: "string", description: "The preconditions of the test script" }
                    },
                    test_data: {
                        type: "array",
                        items: { type: "string", description: "Test data of the test script. Provide always mock data" }
                    },
                    test_steps_results: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                step_name: { type: "string", description: "State the name of the test including if it is a happy flow, negative, edge or normal case" },
                                test_steps: {
                                    type: "array",
                                    items: { type: "string", description: "Describe subsequent steps to this test" }
                                },
                                expected_results: { type: "string", description: "Expected results" },
                                pass_fail_criteria: {
                                    type: "object",
                                    properties: {
                                        pass_criteria: {
                                            type: "array",
                                            items: { type: "string", description: "Provide pass criterion" },
                                        },
                                        fail_criteria: {
                                            type: "array",
                                            items: { type: "string", description: "Provide fail criterion" },
                                        }
                                    },
                                    required: ["pass_criteria", "fail_criteria"]
                                }
                            },
                            required: ["step_name", "test_steps", "expected_results", "pass_fail_criteria"]
                        }
                    },
                    notes: {
                        type: "array",
                        items: { type: "string", description: "provide note" }
                    }
                },
                required: ["test_case", "objective", "preconditions", "test_data", "test_steps_results", "pass_fail_criteria", "notes"]
            }
        }],
        tool_choice: { type: "tool", name: "get_test_cases" },
        messages: [{
            role: "user",
            content: [
                { type: "text", text: userPrompt }
            ]
        }]
    });
    console.log(msg);
    return msg;
}