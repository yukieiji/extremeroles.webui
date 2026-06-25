import "@testing-library/jest-dom";
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { translationMetaData } from "@/logics/api";
import { mockTranslations } from "../mocks/mockTranslations";

// Ensure translationMetaData is populated for tests
Object.assign(translationMetaData, mockTranslations);
translationMetaData[0] = "OFF";
translationMetaData[1] = "ON";

// Mocking PointerEvent methods for Base UI / Radix UI components in JSDOM
if (typeof Element.prototype.setPointerCapture !== "function") {
	Element.prototype.setPointerCapture = vi.fn();
}
if (typeof Element.prototype.releasePointerCapture !== "function") {
	Element.prototype.releasePointerCapture = vi.fn();
}

// Mocking ResizeObserver which is often needed for modern UI libs
class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

window.ResizeObserver = ResizeObserver;
