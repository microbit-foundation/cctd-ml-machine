export type RadioButtonAction = {
    onSelect: () => void, 
    label: string,
    onDeselect?: () => void
}