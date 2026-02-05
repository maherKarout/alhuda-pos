import { Button } from "@mui/material";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SimpleDialog from "../dialog";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { MarkerF } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

type propsType = {
  location: {
    latitude?: number;
    longitude?: number;
  };
  children?: React.ReactNode;
  title?: string;
};

function GoogleMapView({ location, title = "show" }: propsType) {
  const { t } = useTranslation("translation");
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
  });
  const [open, setOpen] = useState(false);

  if (!location) return <>{t("not added")}</>;

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t(title)}</Button>
      <SimpleDialog
        open={open}
        setOpen={setOpen}
        title=""
        fullWidth={true}
        maxWidth={"lg"}
      >
        <div style={{ height: "70vh", minWidth: "500px" }}>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{
                lat: location.latitude as number,
                lng: location.longitude as number,
              }}
              zoom={19}
            >
              <MarkerF
              
                position={{
                  lat: location.latitude as number,
                  lng: location.longitude as number,
                }}
              />
            </GoogleMap>
          )}
        </div>
      </SimpleDialog>
    </>
  );
}

export default GoogleMapView;
