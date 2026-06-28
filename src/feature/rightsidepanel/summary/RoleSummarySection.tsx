import { Separator } from "@/components/ui/separator";
import { ExRRoleSummaryRow } from "./ExRRoleSummaryRow";
import { useActiveRoleSummary } from "./useActiveRoleSummary";
import { VanillaRoleSummaryRow } from "./VanillaRoleSummaryRow";

export function RoleSummarySection() {
	const { activeVanillaCategories, activeExRCategories } =
		useActiveRoleSummary();

	const hasVanilla = activeVanillaCategories.length > 0;
	const hasExR = activeExRCategories.length > 0;

	return (
		<>
			{activeVanillaCategories.map((catId) => (
				<VanillaRoleSummaryRow key={catId} categoryId={catId} />
			))}
			{hasVanilla && hasExR && (
				<Separator className="data-horizontal:w-4/5 mx-auto bg-border-weak" />
			)}
			{activeExRCategories.map((catId) => (
				<ExRRoleSummaryRow key={catId} categoryId={catId} />
			))}
		</>
	);
}
