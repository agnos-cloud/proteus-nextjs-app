import { Plan } from "@character/types";

const rules = {
    maxInstructionLength: (plan: Plan) => {
        switch (plan) {
            case Plan.ADVANCED:
                return 5000;
            case Plan.PRO:
                return 2000;
            default:
                return 1000;
        }
    },
    maxKnowledgeTextLength: (plan: Plan) => {
        switch (plan) {
            case Plan.ADVANCED:
                return 10000;
            case Plan.PRO:
                return 4000;
            default:
                return 2000;
        }
    }
};

export default rules;
