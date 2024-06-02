import { ImageResponse } from "next/og";



import { DESCRIPTION, TITLE } from "@/app/shared-metadata";
import { BasicLayout } from "../_components/basic-layout";
import { SIZE, calSemiBold, interLight, interRegular } from "../utils";

export const runtime = "edge";

export async function GET(req: Request) {
  // const [interRegularData, interLightData, calSemiBoldData] = await Promise.all(
  //   [interRegular, interLight, calSemiBold],
  // );

  const { searchParams } = new URL(req.url);

  const slug = searchParams.has("slug") ? searchParams.get("slug") : undefined;



  return new ImageResponse(
    <BasicLayout title={'Malta Calculator Service'} description={"Malta Salary Calculator"} tw="py-24 px-24">
    </BasicLayout>,
    {
      ...SIZE,
      fonts: [
        // {
        //   name: "Inter",
        //   data: interRegularData,
        //   style: "normal",
        //   weight: 400,
        // },
        // {
        //   name: "Inter",
        //   data: interLightData,
        //   style: "normal",
        //   weight: 300,
        // },
        // {
        //   name: "Cal",
        //   data: calSemiBoldData,
        //   style: "normal",
        //   weight: 600,
        // },
      ],
    },
  );
}
