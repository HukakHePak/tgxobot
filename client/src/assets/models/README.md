Add your glTF or GLB models here to have them bundled by Vite.

- Place a file named `rocket.gltf` or `rocket.glb` (or any name) inside this folder.
- This project will automatically detect the first `*.gltf`/`*.glb` file in this folder and use it as the rocket model.
- When you add a model, Vite will bundle it and the in-app loader will pick it up automatically.

Notes:
- Files added to `public/` are served as-is (not bundled). To include models in the build output and take advantage of Vite's asset handling, add them under `src/assets/models`.
- If your model references external textures, place them alongside the model or update paths accordingly.

Replace this README with the model files when you're ready.
