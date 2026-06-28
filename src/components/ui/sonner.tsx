import {
	CircleCheckIcon,
	InfoIcon,
	Loader2Icon,
	OctagonXIcon,
	TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { TYPOGRAPHY } from "@/designConstants";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			icons={{
				success: (
					<CircleCheckIcon
						className={`${TYPOGRAPHY.LABEL} size-4 text-success`}
					/>
				),
				info: <InfoIcon className="size-4" />,
				warning: <TriangleAlertIcon className="size-4" />,
				error: <OctagonXIcon className="size-4" />,
				loading: <Loader2Icon className="size-4 animate-spin" />,
			}}
			style={
				{
					"--normal-bg": "var(--n4-components-background)",
					"--normal-text": "var(--text-primary)",
					"--normal-border": "var(--n2-border-strong)",
					"--border-radius": "var(--radius)",
				} as React.CSSProperties
			}
			toastOptions={{
				classNames: {
					toast:
						"group-[.toaster]:bg-n4-components-background group-[.toaster]:text-text-primary group-[.toaster]:border-border-strong group-[.toaster]:shadow-lg text-base font-normal",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
