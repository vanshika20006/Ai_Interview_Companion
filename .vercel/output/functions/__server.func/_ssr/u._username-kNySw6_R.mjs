import { _ as lazyRouteComponent, qt as notFound, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as getPublicProfileByUsername } from "./publicProfile.functions-COe0SK2v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/u._username-kNySw6_R.js
var $$splitComponentImporter = () => import("./u._username-CPiaGSKh.mjs");
var $$splitErrorComponentImporter = () => import("./u._username-B_4Fcm8X.mjs");
var $$splitNotFoundComponentImporter = () => import("./u._username-BDIrGlQQ.mjs");
var Route = createFileRoute("/u/$username")({
	ssr: true,
	loader: async ({ params }) => {
		const data = await getPublicProfileByUsername({ data: { username: params.username } });
		if (!data) throw notFound();
		return data;
	},
	head: ({ loaderData, params }) => ({ meta: [
		{ title: `${loaderData?.profile?.full_name ?? params.username} — Placement AI Portfolio` },
		{
			name: "description",
			content: loaderData?.pp?.headline ?? loaderData?.pp?.bio ?? "Placement portfolio"
		},
		{
			property: "og:title",
			content: `${loaderData?.profile?.full_name ?? params.username} — Placement Portfolio`
		},
		{
			property: "og:description",
			content: loaderData?.pp?.headline ?? "Public placement portfolio"
		}
	] }),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
