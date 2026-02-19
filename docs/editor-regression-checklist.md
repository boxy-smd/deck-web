# Editor Rich Text Regression Checklist

## Bubble Menu Visibility And Overflow

1. Select text near the top of the editor and confirm the text bubble menu appears.
2. Scroll the editor until the selected text leaves the visible area and confirm the bubble menu disappears.
3. Select an image and confirm the image bubble menu appears with all actions visible.
4. Scroll until the selected image leaves the editor viewport and confirm the image bubble menu disappears.
5. While scrolling the page, confirm neither bubble menu overlaps the application header.

## Bubble Menu Interaction

1. With image selected, use width controls (`33%`, `66%`, `100%`) and confirm size updates.
2. Use alignment controls (left, center, right) and confirm layout updates.
3. Click `Editar texto alternativo` and confirm `alt` updates in image attributes.
4. Click `Remover imagem` and confirm the selected image is removed.

## Keyboard Accessibility

1. Focus a bubble menu button and navigate with arrow keys.
2. Confirm `Home` focuses first action and `End` focuses last action.
3. On table floating menu, confirm vertical arrow keys move focus between actions.

## Image Preference Persistence

1. Select an image and set width/alignment.
2. Insert a new image from URL and confirm it uses the same width/alignment.
3. Insert a new image by upload and confirm it uses the same width/alignment.
4. Paste or drop an image in the editor and confirm it uses the same width/alignment.

