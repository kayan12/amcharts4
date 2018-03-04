/**
 * Text class deals with all text placed on chart.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents, SpriteEventDispatcher, AMEvent } from "../Sprite";
import { DataItem } from "../DataItem";
import { TextValign } from "../defs/TextValign";
import { TextAlign } from "../defs/TextAlign";
import { IRectangle } from "../defs/IRectangle";
import { Group } from "../rendering/Group";
import { MultiDisposer } from "../utils/Disposer";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines available font weights.
 *
 * @type {string}
 */
export declare type FontWeight = "normal" | "bold" | "bolder" | "lighter" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
/**
 * Defines available text decorations.
 *
 * @type {string}
 */
export declare type TextDecoration = "none" | "underline" | "overline" | "line-through" | "blink";
/**
 * Defines properties for [[Text]].
 */
export interface ITextProperties extends ISpriteProperties {
    /**
     * Horizontal align of the text.
     *
     * @default "start"
     * @type {TextAlign}
     */
    textAlign?: TextAlign;
    /**
     * Vertical align of the text.
     *
     * @default "top"
     * @type {TextValign}
     */
    textValign?: TextValign;
    /**
     * A plain text content.
     *
     * @type {string}
     */
    text?: string;
    /**
     * Should the lines wrap if they do not fit into max width?
     *
     * @default false
     * @type {boolean}
     */
    wrap?: boolean;
    /**
     * Should the text be selectable>
     *
     * @default false
     * @type {boolean}
     */
    selectable?: boolean;
    /**
     * HTML content.
     *
     * @type {string}
     */
    html?: string;
    /**
     * Font size for the text.
     *
     * @type {number}
     */
    fontSize?: number;
    /**
     * Should the lines be truncated (optionally with ellipsis) if they do not
     * fit into max width?
     *
     * @default false
     * @type {boolean}
     */
    truncate?: boolean;
    /**
     * If lines are truncated, this ellipsis will be added at the end.
     *
     * @default "..."
     * @type {string}
     */
    ellipsis?: string;
    /**
     * Hide text of it does not fit into element's dimensions?
     *
     * @default false
     * @type {boolean}
     */
    hideOversized?: boolean;
    /**
     * Default font weight.
     *
     * @default "normal"
     * @type {FontWeight}
     */
    fontWeigth?: FontWeight;
    /**
     * Default font decoration.
     *
     * @default "none"
     * @type {TextDecoration}
     */
    textDecoration?: TextDecoration;
}
/**
 * Text line information.
 *
 * Objects used to hold cached information about lines in a Text element.
 */
export interface ITextLineInfo {
    /**
     * Measurements for the bounding box of the line.
     *
     * @type {SVGRect}
     */
    "bbox"?: SVGRect;
    /**
     * A reference to an SVG `<g>` element that holds line elements.
     *
     * @type {Group}
     */
    "element"?: Group;
    /**
     * Indicates if line contains more than one element, e.g. has multiple
     * formatted blocks.
     *
     * @type {boolean}
     */
    "complex"?: boolean;
}
/**
 * Defines events for [[Text]].
 */
export interface ITextEvents extends ISpriteEvents {
}
/**
 * Adapters for [[Text]].
 *
 * Includes both the [[Adapter]] definitions and properties.
 *
 * @see {@link Adapter}
 */
export interface ITextAdapters extends ISpriteAdapters, ITextProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Text is used to display highly configurable, data-enabled textual elements.
 *
 * ## Data Binding
 *
 * A Text element can dynamically parse and populate its contents with values
 * from a [[DataItem]].
 *
 * To activate such binding, set element's `dataItem` property.
 *
 * When activated, text contents will be parsed for special tags, e.g.:
 *
 * ```TypeScript
 * label.dataItem = myDataItem;
 * label.text = "The title is: ${title}";
 * ```
 * ```JavaScript
 * label.dataItem = myDataItem;
 * label.text = "The title is: ${title}";
 * ```
 *
 * The above will atuomatically replace "${title}" in the string with the
 * actual data value from `myDataItem`.
 *
 * ## Fast Rendering
 *
 * Creating elements in SVG is expensive. If you are redrawing textual elements
 * constantly, like animating a value, you might consider enabling "shallow
 * rendering".
 *
 * ```TypeScript
 * text.shallowRendering = true;
 * ```
 * ```JavaScript
 * text.shallowRendering = true;
 * ```
 *
 * If this is set to `true` [[Text]] will try to re-use cached line height
 * and DOM elements in order to speed up rendering as much as possible.
 *
 * The downside is that dimensions of the text element might change during
 * the process, making it not fit into selected bounds, and/or not well
 * aligned.
 *
 *
 * @see {@link ITextEvents} for a list of available events
 * @see {@link ITextAdapters} for a list of available Adapters
 * @todo Vertical align
 * @todo Linkage to relative documentation (formatters, data binding)
 * @important
 */
export declare class Text extends Sprite {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ITextProperties}
     */
    _properties: ITextProperties;
    /**
     * Defines Adapter type.
     *
     * @ignore Exclude from docs
     * @type {ITextAdapters}
     */
    _adapter: ITextAdapters;
    /**
     * Event dispatcher.
     *
     * @type {SpriteEventDispatcher<AMEvent<Text, ITextEvents>>} Event dispatcher instance
     */
    events: SpriteEventDispatcher<AMEvent<Text, ITextEvents>>;
    /**
     * Indicates if the whole text does not fit into max dimenstions set for it.
     *
     * @type {boolean}
     */
    isOversized: boolean;
    /**
     * Currently formatted text. This is used to verifying if text element needs
     * to be redrawn.
     *
     * @type {string}
     */
    protected _currentText: string;
    /**
     * Current format to be used for outputing text.
     *
     * @type {string}
     */
    protected _currentFormat: string;
    /**
     * [_sourceDataItemEvents description]
     *
     * @todo Description
     * @type {MultiDisposer}
     */
    protected _sourceDataItemEvents: MultiDisposer;
    /**
     * Constructor
     */
    constructor();
    /**
     * Redraws the element, but only if the text actually changed from the
     * currently displayed one.
     *
     * This is useful for saving processing power by eliminating unnecessary
     * expensive redraws.
     */
    update(): void;
    /**
     * Updates current text according to data item and supported features.
     * Returns `true` if current text has changed.
     *
     * @return {boolean} Text changed?
     */
    protected updateCurrentText(): boolean;
    /**
     * Draws the textual label.
     *
     * @ignore Exclude from docs
     */
    draw(): void;
    /**
     * Aligns the lines horizontally ant vertically, based on properties.
     *
     * @ignore Exclude from docs
     */
    alignSVGText(): void;
    /**
     * Produces an SVG line element with formatted text.
     *
     * @ignore Exclude from docs
     * @param  {string}     text    Text to wrap into line
     * @param  {number}     y       Current line vertical position
     * @return {AMElement}          A DOM element
     * @todo Implement HTML support
     */
    getSVGLineElement(text: string, y?: number): Group;
    /**
     * Updates cached bbox dimensions for each text line, just so we don't have to
     * measure the whole element all over again when we're done painting it.
     *
     * @ignore Exclude from docs
     * @param {IRectangle} lineBBox Line's BBox
     */
    updateBBox(lineBBox: IRectangle): void;
    /**
     * Resets cached BBox.
     *
     * @ignore Exclude from docs
     */
    resetBBox(): void;
    /**
     * Creates and returns an HTML line element (`<div>`).
     *
     * @ignore Exclude from docs
     * @param  {string}       text  Text to add
     * @return {HTMLElement}        `<div>` element reference
     */
    getHTMLLineElement(text: string): HTMLElement;
    /**
     * Applies specific styles to text to make it not selectable, unless it is
     * explicitly set as `selectable`.
     *
     * @ignore Exclude from docs
     * @todo Set styles via AMElement
     */
    setStyles(): void;
    /**
     * Returns current SVG text.
     *
     * @return {string} SVG text
     */
    /**
     * Sets SVG text.
     *
     * Please note that setting `html` will override this setting if browser
     * supports `foreignObject` in SGV, such as most modern browsers excluding
     * IEs.
     *
     * @param {string} value SVG Text
     */
    text: string;
    /**
     * Returns current auto-wrap setting.
     *
     * @return {boolean} Auto-wrap enabled or not
     */
    /**
     * Enables or disables autowrapping of text.
     *
     * @param {boolean} value Auto-wrapping enabled
     */
    wrap: boolean;
    /**
     * Returns current truncation setting.
     *
     * @return {boolean} Truncate text?
     */
    /**
     * Indicates if text lines need to be truncated if they do not fit, using
     * configurable `ellipsis` string.
     *
     * `truncate` overrides `wrap` if both are set to `true`.
     *
     * NOTE: For HTML text, this setting **won't** trigger a parser and actual
     * line truncation with ellipsis. It will just hide everything that goes
     * outside the label.
     *
     * @param {boolean}  value  trincate text?
     */
    truncate: boolean;
    /**
     * Returns current ellipsis setting.
     *
     * @return {string} Ellipsis string
     */
    /**
     * Sets ellipsis character to use if `truncate` is enabled.
     *
     * @param {string} value Ellipsis string
     * @default "..."
     */
    ellipsis: string;
    /**
     * Returns current setting for selectable text.
     *
     * @return {boolean} Text selectable?
     */
    /**
     * Forces the text to be selectable. This setting will be ignored if the
     * object has some kind of interaction attached to it, such as it is
     * `draggable`, `swipeable`, `resizable`.
     *
     * @param {boolean}  value  Text selectable?
     * @default false
     */
    selectable: boolean;
    /**
     * Returns current horizontal text alignement.
     *
     * @return {TextAlign} Alignement
     */
    /**
     * Sets text alignement.
     *
     * Available choices:
     * * "start"
     * * "middle"
     * * "end"
     *
     * @param {TextAlign} value Alignement
     */
    textAlign: TextAlign;
    /**
     * Returns vertical text alignement.
     *
     * @ignore Exclude from docs (not used)
     * @return {TextValign} Alignement
     * @deprecated
     */
    /**
     * Sets vertical text alignement.
     *
     * @ignore Exclude from docs (not used)
     * @param {TextValign} value Alignement
     * @deprecated
     */
    textValign: TextValign;
    /**
     * Returns current font size for text element.
     *
     * @return {any} Font size
     */
    /**
     * Sets font size to be used for the text. The size can either be numeric, in
     * pxels, or other measurements.
     *
     * Parts of the text may override this setting using in-line formatting.
     *
     * @param {any} value Font size value
     */
    fontSize: any;
    /**
     * Returns currently set font weight.
     *
     * @return {FontWeight} Font weight
     */
    /**
     * Sets font weight to use for text.
     *
     * Parts of the text may override this setting using in-line formatting.
     *
     * @param {FontWeight} value Font weight
     */
    fontWeigth: FontWeight;
    /**
     * Returns current text decoration setting.
     *
     * @return {TextDecoration} Decoration
     */
    /**
     * Sets a text decoration to use for text.
     *
     * Parts of the text may override this setting using in-line formatting.
     *
     * @param {TextDecoration} value Decoration
     */
    textDecoration: TextDecoration;
    /**
     * Returns current HTML content of the label.
     *
     * @return {string} HTML content
     */
    /**
     * Sets raw HTML to be used as text.
     *
     * NOTE: HTML text is subject to browser support. It relies on browsers
     * supporting SVG `foreignObject` nodes. Some browsers (read IEs) do not
     * support it. On those browsers, the text will fall back to basic SVG text,
     * striping out all HTML markup and styling that goes with it.
     *
     * For more information about `foreignObject` and its browser compatibility
     * refer to [this page](https://developer.mozilla.org/en/docs/Web/SVG/Element/foreignObject#Browser_compatibility).
     *
     * @param {string} value HTML text
     */
    html: string;
    /**
     * Returns current setting for hiding oversized text.
     *
     * @return {boolean} Hide if text does not fit?
     */
    /**
     * Sets whether the whole text should be hidden if it does not fit into its
     * allotted space.
     *
     * @param {boolean} value Hide if text does not fit?
     */
    hideOversized: boolean;
    /**
     * Override `mesaureElement` so it does not get measure again, because
     * internal `_bbox` is being updated by measuring routines in Text itself.
     */
    protected measureElement(): void;
    /**
     * Returns information about a line element.
     *
     * @ignore Exclude from docs
     * @param  {number}         index  Line index
     * @return {ITextLineInfo}         Line info object
     */
    getLineInfo(index: number): ITextLineInfo;
    /**
     * Adds a line to line info cache.
     *
     * @ignore Exclude from docs
     * @param {ITextLineInfo}  line     Line info object
     * @param {boolean}        replace  Replace existing item
     * @param {number}         index    Insert at specified index
     */
    addLineInfo(line: ITextLineInfo, replace?: boolean, index?: number): void;
    /**
     * Checks if line cache is initialized and initializes it.
     */
    private initLineCache();
    /**
     * Sets a [[DataItem]] to use for populating dynamic sections of the text.
     *
     * Check the description for [[Text]] class, for data binding.
     *
     * @param {DataItem} dataItem Data item
     */
    setDataItem(dataItem: DataItem): void;
    /**
     * Returns available horizontal space.
     *
     * @ignore Exclude from docs
     * @return {number} Available width (px)
     */
    readonly availableWidth: number;
    /**
     * Returns available vertical space.
     *
     * @return {number} Available height (px)
     */
    readonly availableHeight: number;
    /**
     * Invalidates the whole element, causing its redraw.
     *
     * Appending `<defs>` section might influence appearance and thus its
     * dimensions.
     *
     * @ignore Exclude from docs
     */
    appendDefs(): void;
}