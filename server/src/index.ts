import { server } from "./server";
import "./socket/io";

if (process.env.NODE_ENV !== 'test') {
	const PORT = process.env.PORT || 5000;

	server.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}