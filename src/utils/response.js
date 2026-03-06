export const ok = (res, data, meta, message = "") => res.json({ success: true, message, data, meta });
export const created = (res, data, message = "Created") => res.status(201).json({ success: true, message, data });
export const noContent = (res) => res.status(204).send();
