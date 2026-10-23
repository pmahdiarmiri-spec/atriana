"use client";

import {
  geoGraticule10,
  geoInterpolate,
  geoNaturalEarth1,
  geoPath
} from "d3-geo";
import {
  AnimatePresence,
  motion,
  useReducedMotion
} from "framer-motion";
import {Activity, Globe2} from "lucide-react";
import {useTranslations} from "next-intl";
import type {
  CSSProperties,
  PointerEvent as PrmPointerEvent
} from "react";
import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {feature} from "topojson-client";
import type {
  GeometryCollection,
  Topology
} from "topojson-specification";
import prmWorldAtlas from "world-atlas/countries-110m.json";

type PrmCoordinate = [number, number];

type PrmWorldObjects = {
  countries: GeometryCollection;
};

type PrmTradeLocation = {
  id: string;
  coordinate: PrmCoordinate;
};

type PrmTradeRoute = {
  id: string;
  start: PrmCoordinate;
  end: PrmCoordinate;
  duration: number;
  delay: number;
  enterDelay: number;
};

type PrmRouteVisual = PrmTradeRoute & {
  path: string;
};

type PrmTradeHub = {
  id: string;
  coordinate: PrmCoordinate;
  delay: number;
};

const prmMapWidth = 1000;
const prmMapHeight = 520;
const prmRouteSegments = 72;
const prmMinimumRouteCount = 5;
const prmMaximumRouteCount = 7;
const prmInitialReplacementDelay = 4200;
const prmMinimumReplacementInterval = 2400;
const prmMaximumReplacementInterval = 3800;
const prmRouteTransitionDuration = 1.15;
const prmHubTransitionDuration = 0.8;

const prmProjection = geoNaturalEarth1()
  .fitExtent(
    [
      [38, 34],
      [962, 486]
    ],
    {
      type: "Sphere"
    }
  )
  .precision(0.1);

const prmPathGenerator = geoPath(prmProjection);

const prmTopology =
  prmWorldAtlas as unknown as Topology<PrmWorldObjects>;

const prmCountries = feature(
  prmTopology,
  prmTopology.objects.countries
);

const prmSpherePath =
  prmPathGenerator({
    type: "Sphere"
  }) ?? "";

const prmGraticulePath =
  prmPathGenerator(geoGraticule10()) ?? "";

const prmTradeLocations: PrmTradeLocation[] = [
  {
    id: "prm-location-tehran",
    coordinate: [51.389, 35.6892]
  },
  {
    id: "prm-location-shanghai",
    coordinate: [121.4737, 31.2304]
  },
  {
    id: "prm-location-dubai",
    coordinate: [55.2708, 25.2048]
  },
  {
    id: "prm-location-rotterdam",
    coordinate: [4.4777, 51.9244]
  },
  {
    id: "prm-location-mumbai",
    coordinate: [72.8777, 19.076]
  },
  {
    id: "prm-location-singapore",
    coordinate: [103.8198, 1.3521]
  },
  {
    id: "prm-location-sao-paulo",
    coordinate: [-46.6333, -23.5505]
  },
  {
    id: "prm-location-lisbon",
    coordinate: [-9.1393, 38.7223]
  },
  {
    id: "prm-location-new-york",
    coordinate: [-74.006, 40.7128]
  },
  {
    id: "prm-location-london",
    coordinate: [-0.1276, 51.5072]
  },
  {
    id: "prm-location-johannesburg",
    coordinate: [28.0473, -26.2041]
  },
  {
    id: "prm-location-tokyo",
    coordinate: [139.6917, 35.6895]
  },
  {
    id: "prm-location-sydney",
    coordinate: [151.2093, -33.8688]
  },
  {
    id: "prm-location-vancouver",
    coordinate: [-123.1207, 49.2827]
  },
  {
    id: "prm-location-los-angeles",
    coordinate: [-118.2437, 34.0522]
  },
  {
    id: "prm-location-mexico-city",
    coordinate: [-99.1332, 19.4326]
  },
  {
    id: "prm-location-buenos-aires",
    coordinate: [-58.3816, -34.6037]
  },
  {
    id: "prm-location-cairo",
    coordinate: [31.2357, 30.0444]
  },
  {
    id: "prm-location-istanbul",
    coordinate: [28.9784, 41.0082]
  },
  {
    id: "prm-location-moscow",
    coordinate: [37.6173, 55.7558]
  },
  {
    id: "prm-location-paris",
    coordinate: [2.3522, 48.8566]
  },
  {
    id: "prm-location-nairobi",
    coordinate: [36.8219, -1.2921]
  },
  {
    id: "prm-location-lagos",
    coordinate: [3.3792, 6.5244]
  },
  {
    id: "prm-location-seoul",
    coordinate: [126.978, 37.5665]
  },
  {
    id: "prm-location-bangkok",
    coordinate: [100.5018, 13.7563]
  }
];

function prmCreateRoutePath(
  prmStart: PrmCoordinate,
  prmEnd: PrmCoordinate
) {
  const prmInterpolator = geoInterpolate(
    prmStart,
    prmEnd
  );

  const prmCoordinates = Array.from(
    {
      length: prmRouteSegments + 1
    },
    (_, prmIndex) => {
      return prmInterpolator(
        prmIndex / prmRouteSegments
      );
    }
  );

  return (
    prmPathGenerator({
      type: "LineString",
      coordinates: prmCoordinates
    }) ?? ""
  );
}

function prmProjectCoordinate(
  prmCoordinate: PrmCoordinate
): PrmCoordinate | null {
  const prmProjectedCoordinate =
    prmProjection(prmCoordinate);

  if (!prmProjectedCoordinate) {
    return null;
  }

  return [
    prmProjectedCoordinate[0],
    prmProjectedCoordinate[1]
  ];
}

function prmGetRandomNumber(
  prmMinimum: number,
  prmMaximum: number
) {
  return (
    Math.random() * (prmMaximum - prmMinimum) +
    prmMinimum
  );
}

function prmGetRandomInteger(
  prmMinimum: number,
  prmMaximum: number
) {
  return Math.floor(
    prmGetRandomNumber(
      prmMinimum,
      prmMaximum + 1
    )
  );
}

function prmShuffleLocations(
  prmLocations: PrmTradeLocation[]
): PrmTradeLocation[] {
  const prmShuffledLocations = [
    ...prmLocations
  ];

  for (
    let prmIndex =
      prmShuffledLocations.length - 1;
    prmIndex > 0;
    prmIndex -= 1
  ) {
    const prmRandomIndex = Math.floor(
      Math.random() * (prmIndex + 1)
    );

    const prmCurrentLocation =
      prmShuffledLocations[prmIndex];

    const prmRandomLocation =
      prmShuffledLocations[prmRandomIndex];

    prmShuffledLocations[prmIndex] =
      prmRandomLocation;

    prmShuffledLocations[prmRandomIndex] =
      prmCurrentLocation;
  }

  return prmShuffledLocations;
}

function prmCreateCoordinateKey(
  prmCoordinate: PrmCoordinate
) {
  return `${prmCoordinate[0]}:${prmCoordinate[1]}`;
}

function prmCreateRoutePairKey(
  prmStart: PrmCoordinate,
  prmEnd: PrmCoordinate
) {
  const prmStartKey =
    prmCreateCoordinateKey(prmStart);

  const prmEndKey =
    prmCreateCoordinateKey(prmEnd);

  return [prmStartKey, prmEndKey]
    .sort()
    .join("|");
}

function prmCreateHubId(
  prmCoordinate: PrmCoordinate
) {
  return `prm-hub-${prmCoordinate[0]
    .toString()
    .replaceAll(".", "-")
    .replaceAll("-", "m")}-${prmCoordinate[1]
    .toString()
    .replaceAll(".", "-")
    .replaceAll("-", "m")}`;
}

function prmCreateHubDelay(
  prmCoordinate: PrmCoordinate
) {
  const prmLongitude =
    Math.abs(prmCoordinate[0]);

  const prmLatitude =
    Math.abs(prmCoordinate[1]);

  return (
    ((prmLongitude * 13 +
      prmLatitude * 7) %
      120) /
    100
  );
}

function prmCreateRandomRoute(
  prmRouteId: string,
  prmExistingRoutes: PrmTradeRoute[],
  prmEnterDelay = 0.12
): PrmTradeRoute {
  const prmExistingRouteKeys = new Set(
    prmExistingRoutes.map((prmRoute) => {
      return prmCreateRoutePairKey(
        prmRoute.start,
        prmRoute.end
      );
    })
  );

  for (
    let prmAttempt = 0;
    prmAttempt < 80;
    prmAttempt += 1
  ) {
    const prmStartIndex =
      prmGetRandomInteger(
        0,
        prmTradeLocations.length - 1
      );

    let prmEndIndex =
      prmGetRandomInteger(
        0,
        prmTradeLocations.length - 1
      );

    while (
      prmEndIndex === prmStartIndex
    ) {
      prmEndIndex =
        prmGetRandomInteger(
          0,
          prmTradeLocations.length - 1
        );
    }

    const prmStart =
      prmTradeLocations[prmStartIndex];

    const prmEnd =
      prmTradeLocations[prmEndIndex];

    const prmRouteKey =
      prmCreateRoutePairKey(
        prmStart.coordinate,
        prmEnd.coordinate
      );

    if (
      !prmExistingRouteKeys.has(
        prmRouteKey
      )
    ) {
      return {
        id: prmRouteId,
        start: prmStart.coordinate,
        end: prmEnd.coordinate,
        duration: prmGetRandomNumber(
          6.8,
          10.8
        ),
        delay: prmGetRandomNumber(
          0.05,
          0.55
        ),
        enterDelay: prmEnterDelay
      };
    }
  }

  const prmFallbackLocations =
    prmShuffleLocations(prmTradeLocations);

  return {
    id: prmRouteId,
    start:
      prmFallbackLocations[0].coordinate,
    end:
      prmFallbackLocations[1].coordinate,
    duration: prmGetRandomNumber(
      6.8,
      10.8
    ),
    delay: prmGetRandomNumber(
      0.05,
      0.55
    ),
    enterDelay: prmEnterDelay
  };
}

function prmCreateInitialRoutes(
  prmSequenceId: number
): PrmTradeRoute[] {
  const prmRouteCount =
    prmGetRandomInteger(
      prmMinimumRouteCount,
      prmMaximumRouteCount
    );

  const prmRoutes: PrmTradeRoute[] = [];

  for (
    let prmIndex = 0;
    prmIndex < prmRouteCount;
    prmIndex += 1
  ) {
    const prmRoute =
      prmCreateRandomRoute(
        `prm-route-${prmSequenceId}-${prmIndex}`,
        prmRoutes,
        prmIndex * 0.2
      );

    prmRoutes.push(prmRoute);
  }

  return prmRoutes;
}

function prmCreateTradeHubs(
  prmRoutes: PrmTradeRoute[]
): PrmTradeHub[] {
  const prmHubMap = new Map<
    string,
    PrmTradeHub
  >();

  prmRoutes.forEach((prmRoute) => {
    const prmRouteCoordinates = [
      prmRoute.start,
      prmRoute.end
    ];

    prmRouteCoordinates.forEach(
      (prmCoordinate) => {
        const prmCoordinateKey =
          prmCreateCoordinateKey(
            prmCoordinate
          );

        if (
          !prmHubMap.has(
            prmCoordinateKey
          )
        ) {
          prmHubMap.set(
            prmCoordinateKey,
            {
              id: prmCreateHubId(
                prmCoordinate
              ),
              coordinate:
                prmCoordinate,
              delay:
                prmCreateHubDelay(
                  prmCoordinate
                )
            }
          );
        }
      }
    );
  });

  return Array.from(
    prmHubMap.values()
  );
}

const prmGlassStyle = {
  "--prm-map-pointer-x": "50%",
  "--prm-map-pointer-y": "20%"
} as CSSProperties;

export default function PrmWorldMap() {
  const prmTranslations =
    useTranslations("home.hero.map");

  const prmShouldReduceMotion =
    useReducedMotion();

  const [
    prmRoutes,
    setPrmRoutes
  ] = useState<PrmTradeRoute[]>([]);

  const prmRouteSequenceRef =
    useRef(0);

  const prmReplacementIndexRef =
    useRef(0);

  useEffect(() => {
    let prmIsDisposed = false;

    let prmReplacementTimer:
      | number
      | undefined;

    const prmInitialSequenceId =
      Date.now();

    prmRouteSequenceRef.current =
      prmInitialSequenceId;

    setPrmRoutes(
      prmCreateInitialRoutes(
        prmInitialSequenceId
      )
    );

    const prmScheduleReplacement = (
      prmDelay: number
    ) => {
      prmReplacementTimer =
        window.setTimeout(() => {
          if (prmIsDisposed) {
            return;
          }

          setPrmRoutes(
            (prmCurrentRoutes) => {
              if (
                prmCurrentRoutes.length === 0
              ) {
                return prmCurrentRoutes;
              }

              const prmReplacementIndex =
                prmReplacementIndexRef.current %
                prmCurrentRoutes.length;

              prmReplacementIndexRef.current =
                prmReplacementIndex + 1;

              prmRouteSequenceRef.current += 1;

              const prmRemainingRoutes =
                prmCurrentRoutes.filter(
                  (_, prmIndex) => {
                    return (
                      prmIndex !==
                      prmReplacementIndex
                    );
                  }
                );

              const prmNewRoute =
                prmCreateRandomRoute(
                  `prm-route-${prmRouteSequenceRef.current}-${prmReplacementIndex}`,
                  prmRemainingRoutes
                );

              return prmCurrentRoutes.map(
                (
                  prmRoute,
                  prmIndex
                ) => {
                  if (
                    prmIndex ===
                    prmReplacementIndex
                  ) {
                    return prmNewRoute;
                  }

                  return prmRoute;
                }
              );
            }
          );

          const prmNextDelay =
            prmGetRandomNumber(
              prmMinimumReplacementInterval,
              prmMaximumReplacementInterval
            );

          prmScheduleReplacement(
            prmNextDelay
          );
        }, prmDelay);
    };

    prmScheduleReplacement(
      prmInitialReplacementDelay
    );

    return () => {
      prmIsDisposed = true;

      if (
        prmReplacementTimer !==
        undefined
      ) {
        window.clearTimeout(
          prmReplacementTimer
        );
      }
    };
  }, []);

  const prmRouteVisuals =
    useMemo<PrmRouteVisual[]>(() => {
      return prmRoutes.map(
        (prmRoute) => ({
          ...prmRoute,
          path: prmCreateRoutePath(
            prmRoute.start,
            prmRoute.end
          )
        })
      );
    }, [prmRoutes]);

  const prmTradeHubs = useMemo(
    () => {
      return prmCreateTradeHubs(
        prmRoutes
      );
    },
    [prmRoutes]
  );

  const prmHandlePointerMove = (
    prmEvent: PrmPointerEvent<HTMLDivElement>
  ) => {
    const prmBounds =
      prmEvent.currentTarget.getBoundingClientRect();

    const prmPointerX =
      ((prmEvent.clientX -
        prmBounds.left) /
        prmBounds.width) *
      100;

    const prmPointerY =
      ((prmEvent.clientY -
        prmBounds.top) /
        prmBounds.height) *
      100;

    prmEvent.currentTarget.style.setProperty(
      "--prm-map-pointer-x",
      `${prmPointerX}%`
    );

    prmEvent.currentTarget.style.setProperty(
      "--prm-map-pointer-y",
      `${prmPointerY}%`
    );
  };

  const prmHandlePointerLeave = (
    prmEvent: PrmPointerEvent<HTMLDivElement>
  ) => {
    prmEvent.currentTarget.style.setProperty(
      "--prm-map-pointer-x",
      "50%"
    );

    prmEvent.currentTarget.style.setProperty(
      "--prm-map-pointer-y",
      "20%"
    );
  };

  const prmRouteMotionDuration =
    prmShouldReduceMotion
      ? 0
      : prmRouteTransitionDuration;

  const prmHubMotionDuration =
    prmShouldReduceMotion
      ? 0
      : prmHubTransitionDuration;

  return (
    <motion.div
      className="prm-world-map-shell relative isolate mx-auto w-full max-w-[790px]"
      initial={{
        opacity: 0,
        y: 18,
        scale: 0.985
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }}
      transition={{
        duration:
          prmShouldReduceMotion
            ? 0
            : 0.75,
        ease: [
          0.22,
          1,
          0.36,
          1
        ]
      }}
    >
      <div className="prm-world-map-ambient pointer-events-none absolute inset-[5%] -z-20 rounded-full bg-amber-300/35 blur-[95px]" />

      <div className="prm-world-map-ambient-secondary pointer-events-none absolute inset-x-[15%] bottom-0 -z-10 h-[42%] rounded-full bg-orange-500/22 blur-[80px]" />

      <div
        className="prm-world-map-glass group relative overflow-hidden rounded-[1.65rem] border border-white/90 bg-white/65 p-2 shadow-[0_35px_90px_rgba(15,23,42,0.18),0_8px_28px_rgba(15,23,42,0.1),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(255,255,255,0.5)] backdrop-blur-3xl backdrop-brightness-110 backdrop-saturate-150 sm:rounded-[2rem] sm:p-3 lg:p-4"
        style={prmGlassStyle}
        onPointerMove={
          prmHandlePointerMove
        }
        onPointerLeave={
          prmHandlePointerLeave
        }
      >
        <div
          className="prm-world-map-interactive-reflection pointer-events-none absolute inset-0 z-30 opacity-50 transition-opacity duration-500 group-hover:opacity-90"
          style={{
            background:
              "radial-gradient(390px circle at var(--prm-map-pointer-x) var(--prm-map-pointer-y), rgba(255,255,255,0.55), rgba(255,255,255,0.12) 30%, transparent 70%)"
          }}
        />

        <div className="prm-world-map-top-highlight pointer-events-none absolute inset-x-8 top-0 z-40 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

        <div className="prm-world-map-side-highlight pointer-events-none absolute inset-y-10 left-0 z-40 w-px bg-gradient-to-b from-transparent via-white to-transparent" />

        <div className="prm-world-map-reflection pointer-events-none absolute -right-24 -top-36 z-0 h-80 w-80 rounded-full bg-white/50 blur-3xl" />

        <div className="prm-world-map-refraction pointer-events-none absolute -bottom-32 -left-24 z-0 h-72 w-72 rounded-full bg-amber-400/20 blur-[70px]" />

        <div className="prm-world-map-status relative z-40 flex items-center justify-between gap-3 px-2 pb-1 sm:px-3 sm:pb-2">
          <div className="prm-world-map-status-item flex items-center gap-2 text-[0.68rem] font-bold text-[var(--prm-text-dark)] sm:text-xs lg:text-sm">
            <span className="prm-world-map-status-icon relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg border border-white/90 bg-white/75 text-[var(--prm-accent-color)] shadow-[0_8px_20px_rgba(15,23,42,0.1),inset_0_1px_0_rgba(255,255,255,1)] backdrop-blur-xl sm:h-8 sm:w-8 sm:rounded-xl">
              <span className="prm-world-map-status-glow absolute inset-0 bg-gradient-to-br from-white to-amber-200/35" />

              <Activity
                className="prm-world-map-status-svg relative z-10 h-3.5 w-3.5 sm:h-4 sm:w-4"
                strokeWidth={2.5}
              />
            </span>

            <span>
              {prmTranslations(
                "liveRoutes"
              )}
            </span>
          </div>

          <div className="prm-world-map-coverage flex items-center gap-1.5 text-[0.68rem] font-semibold text-[var(--prm-text-dark)] sm:text-xs lg:text-sm">
            <Globe2
              className="prm-world-map-coverage-icon h-3.5 w-3.5 text-[var(--prm-secondary-color)] sm:h-4 sm:w-4"
              strokeWidth={2.4}
            />

            <span>
              {prmTranslations(
                "coverage"
              )}
            </span>
          </div>
        </div>

        <svg
          viewBox={`0 0 ${prmMapWidth} ${prmMapHeight}`}
          role="img"
          aria-label={prmTranslations(
            "ariaLabel"
          )}
          className="prm-world-map-svg relative z-10 block max-h-[38svh] w-full lg:max-h-[72svh]"
        >
          <defs>
            <linearGradient
              id="prm-map-ocean"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#dbeafe"
                stopOpacity="0.96"
              />

              <stop
                offset="48%"
                stopColor="#e2e8f0"
                stopOpacity="0.94"
              />

              <stop
                offset="100%"
                stopColor="#ffedd5"
                stopOpacity="0.92"
              />
            </linearGradient>

            <linearGradient
              id="prm-map-country"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#94a3b8"
              />

              <stop
                offset="48%"
                stopColor="#64748b"
              />

              <stop
                offset="100%"
                stopColor="#334155"
              />
            </linearGradient>

            <linearGradient
              id="prm-route-gradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop
                offset="0%"
                stopColor="#fbbf24"
                stopOpacity="0.75"
              />

              <stop
                offset="48%"
                stopColor="#f59e0b"
                stopOpacity="1"
              />

              <stop
                offset="100%"
                stopColor="#ea580c"
                stopOpacity="0.95"
              />
            </linearGradient>

            <radialGradient id="prm-node-gradient">
              <stop
                offset="0%"
                stopColor="#ffffff"
              />

              <stop
                offset="30%"
                stopColor="#fbbf24"
              />

              <stop
                offset="68%"
                stopColor="#f59e0b"
              />

              <stop
                offset="100%"
                stopColor="#c2410c"
              />
            </radialGradient>

            <filter
              id="prm-map-shadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="150%"
            >
              <feDropShadow
                dx="0"
                dy="8"
                stdDeviation="8"
                floodColor="#0f172a"
                floodOpacity="0.27"
              />
            </filter>

            <filter
              id="prm-country-shadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="150%"
            >
              <feDropShadow
                dx="0"
                dy="3"
                stdDeviation="2.5"
                floodColor="#0f172a"
                floodOpacity="0.28"
              />
            </filter>

            <filter
              id="prm-route-glow"
              x="-150%"
              y="-150%"
              width="400%"
              height="400%"
            >
              <feGaussianBlur
                stdDeviation="3.6"
                result="prm-route-blur"
              />

              <feMerge>
                <feMergeNode in="prm-route-blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter
              id="prm-plane-shadow"
              x="-250%"
              y="-250%"
              width="600%"
              height="600%"
            >
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="3.5"
                floodColor="#9a3412"
                floodOpacity="0.75"
              />
            </filter>

            <clipPath id="prm-map-sphere-clip">
              <path
                d={prmSpherePath}
              />
            </clipPath>
          </defs>

          <g
            className="prm-world-map-sphere"
            filter="url(#prm-map-shadow)"
          >
            <path
              d={prmSpherePath}
              fill="url(#prm-map-ocean)"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
          </g>

          <g
            className="prm-world-map-content"
            clipPath="url(#prm-map-sphere-clip)"
          >
            <path
              className="prm-world-map-graticule"
              d={prmGraticulePath}
              fill="none"
              stroke="#475569"
              strokeWidth="0.75"
              strokeOpacity="0.25"
            />

            <g
              className="prm-world-map-countries"
              fill="url(#prm-map-country)"
              stroke="#f8fafc"
              strokeWidth="0.85"
              strokeLinejoin="round"
              filter="url(#prm-country-shadow)"
            >
              {prmCountries.features.map(
                (
                  prmCountry,
                  prmIndex
                ) => (
                  <path
                    key={`prm-country-${prmCountry.id ?? prmIndex}`}
                    d={
                      prmPathGenerator(
                        prmCountry
                      ) ?? ""
                    }
                  />
                )
              )}
            </g>

            <g className="prm-world-map-routes">
              <AnimatePresence
                initial
                mode="sync"
              >
                {prmRouteVisuals.map(
                  (prmRoute) => (
                    <motion.g
                      key={prmRoute.id}
                      className="prm-world-map-route"
                      initial={{
                        opacity: 0
                      }}
                      animate={{
                        opacity: 1
                      }}
                      exit={{
                        opacity: 0
                      }}
                      transition={{
                        duration:
                          prmRouteMotionDuration,
                        delay:
                          prmShouldReduceMotion
                            ? 0
                            : prmRoute.enterDelay,
                        ease: [
                          0.22,
                          1,
                          0.36,
                          1
                        ]
                      }}
                    >
                      <path
                        d={prmRoute.path}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeOpacity="0.85"
                      />

                      <path
                        id={prmRoute.id}
                        d={prmRoute.path}
                        fill="none"
                        stroke="url(#prm-route-gradient)"
                        strokeWidth="3.3"
                        strokeLinecap="round"
                        strokeDasharray="9 8"
                        filter="url(#prm-route-glow)"
                      >
                        {!prmShouldReduceMotion && (
                          <animate
                            attributeName="stroke-dashoffset"
                            from="34"
                            to="0"
                            dur="1.35s"
                            repeatCount="indefinite"
                          />
                        )}
                      </path>

                      {!prmShouldReduceMotion && (
                        <g
                          className="prm-world-map-plane"
                          fill="#ea580c"
                          stroke="#ffffff"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                          filter="url(#prm-plane-shadow)"
                          transform="scale(1.18)"
                        >
                          <path d="M15 0 L4 -3.8 L-3.5 -13 L-8 -13 L-4.5 -2.8 L-15 -5.5 L-20 0 L-4.5 2.8 L-8 13 L-3.5 13 L4 3.8 Z" />

                          <animateMotion
                            dur={`${prmRoute.duration}s`}
                            begin={`${prmRoute.delay}s`}
                            repeatCount="indefinite"
                            rotate="auto"
                          >
                            <mpath
                              href={`#${prmRoute.id}`}
                            />
                          </animateMotion>
                        </g>
                      )}
                    </motion.g>
                  )
                )}
              </AnimatePresence>
            </g>

            <g className="prm-world-map-hubs">
              <AnimatePresence
                initial
                mode="sync"
              >
                {prmTradeHubs.map(
                  (prmHub) => {
                    const prmProjectedHub =
                      prmProjectCoordinate(
                        prmHub.coordinate
                      );

                    if (
                      !prmProjectedHub
                    ) {
                      return null;
                    }

                    const [
                      prmHubX,
                      prmHubY
                    ] = prmProjectedHub;

                    return (
                      <motion.g
                        key={prmHub.id}
                        className="prm-world-map-hub"
                        initial={{
                          opacity: 0
                        }}
                        animate={{
                          opacity: 1
                        }}
                        exit={{
                          opacity: 0
                        }}
                        transition={{
                          duration:
                            prmHubMotionDuration,
                          ease: [
                            0.22,
                            1,
                            0.36,
                            1
                          ]
                        }}
                      >
                        <circle
                          cx={prmHubX}
                          cy={prmHubY}
                          r="7"
                          fill="#f59e0b"
                          fillOpacity="0.55"
                        >
                          {!prmShouldReduceMotion && (
                            <>
                              <animate
                                attributeName="r"
                                values="6;18;6"
                                dur="2.6s"
                                begin={`${prmHub.delay}s`}
                                repeatCount="indefinite"
                              />

                              <animate
                                attributeName="fill-opacity"
                                values="0.65;0;0.65"
                                dur="2.6s"
                                begin={`${prmHub.delay}s`}
                                repeatCount="indefinite"
                              />
                            </>
                          )}
                        </circle>

                        <circle
                          cx={prmHubX}
                          cy={prmHubY}
                          r="5.2"
                          fill="url(#prm-node-gradient)"
                          stroke="#ffffff"
                          strokeWidth="2.1"
                          filter="url(#prm-route-glow)"
                        />
                      </motion.g>
                    );
                  }
                )}
              </AnimatePresence>
            </g>
          </g>
        </svg>
      </div>
    </motion.div>
  );
}
