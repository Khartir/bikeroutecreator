import { LeafletMouseEvent } from "leaflet";
import { Marker } from "react-leaflet";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { moveWayPoint, selectWayPoints, selectShowElevationMap } from "./routeSlice";
import { turfToLatLng } from "../leaflet/leafletHelpers";

export function WayPoints() {
    const wayPoints = useAppSelector(selectWayPoints);
    // due to bad performance map is only editable if elevation is not shown
    const showWayPoints = !useAppSelector(selectShowElevationMap);
    const dispatch = useAppDispatch();
    const lastIndex = wayPoints.length - 1;
    if (!showWayPoints || lastIndex <= 0) {
        return null;
    }

    return (
        <>
            {wayPoints.map((wayPoint, index) => {
                if (index === 0 || index === lastIndex) {
                    return null;
                }
                return (
                    <Marker
                        position={turfToLatLng(wayPoint)}
                        key={index}
                        draggable
                        eventHandlers={{
                            move: (e) =>
                                dispatch(
                                    moveWayPoint({
                                        index,
                                        position: [
                                            (e as LeafletMouseEvent).latlng.lng,
                                            (e as LeafletMouseEvent).latlng.lat,
                                        ],
                                    })
                                ),
                        }}
                    />
                );
            })}
        </>
    );
}
