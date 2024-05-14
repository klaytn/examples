/**
 * @param {SendBtnProps}
 *
 * @typedef {{
*   children: string
* }} SendBtnProps
*/
export function SendBtn({ children }) {
 return `
   <button class="text-kaikas-primary border bg-white border-kaikas-primary w-min px-4 py-2 rounded-md hover:bg-kaikas-primary hover:text-white" type="submit">${children}</button>
 `;
}
