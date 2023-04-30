import { cubicOut } from "svelte/easing";

export function horizontalSlide(element: any, {
	delay = 0,
	duration = 400,
	easing = cubicOut,
	axis = "x"
} = {}) {
	const style = getComputedStyle(element);
	const opacity = +style.opacity;
	const primary_property = axis === "y" ? "height" : "width";
	const primary_property_value = parseFloat(style[primary_property]);
	const secondary_properties = axis === "y" ? ["top", "bottom"] : ["left", "right"];
	const capitalized_secondary_properties = secondary_properties.map((e) => `${e[0].toUpperCase()}${e.slice(1)}`);

	// @ts-ignore
	const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
	// @ts-ignore
	const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
	// @ts-ignore
	const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
	// @ts-ignore
	const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
	// @ts-ignore
	const border_width_start_value = parseFloat(style[`border${capitalized_secondary_properties[0]}Width`]);
	// @ts-ignore
	const border_width_end_value = parseFloat(style[`border${capitalized_secondary_properties[1]}Width`]);
	return {
		delay,
		duration,
		easing,
		css: (t: number) =>
			"overflow: hidden;" +
			`opacity: ${Math.min(t * 20, 1) * opacity};` +
			`${primary_property}: ${t * primary_property_value}px;` +
			`padding-${secondary_properties[0]}: ${t * padding_start_value}px;` +
			`padding-${secondary_properties[1]}: ${t * padding_end_value}px;` +
			`margin-${secondary_properties[0]}: ${t * margin_start_value}px;` +
			`margin-${secondary_properties[1]}: ${t * margin_end_value}px;` +
			`border-${secondary_properties[0]}-width: ${t * border_width_start_value}px;` +
			`border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;`
	};
}
