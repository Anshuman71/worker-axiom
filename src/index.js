import { customAlphabet } from "nanoid";

const customNanoId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  12
);

const flattenObject = (obj, prefix = "") =>
  Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? `${prefix}.` : "";
    if (
      typeof obj[k] === "object" &&
      obj[k] !== null &&
      Object.keys(obj[k]).length > 0
    )
      Object.assign(acc, flattenObject(obj[k], pre + k));
    else acc[pre + k] = obj[k];
    return acc;
  }, {});

export function createAxiomClient(config) {
  const AXIOM_INGEST_URL = `https://api.axiom.co/v1/datasets/${config.datasetName}/ingest`;

  return (data) => {
    let logs = [];

    const loggerID = customNanoId();

    let loggerData = data ? { ...data } : {};
    let initTime = Date.now();

    function updateLoggerData(data) {
      loggerData = { ...loggerData, ...data };
    }

    function log(message, data) {
      if (config.alsoLogToConsole !== false) {
        console.log(message, data);
      }
      logs.push({ message, timestamp: Date.now(), ...data });
    }

    async function sendLogs(statusCode = 200) {
      let finalLogs = [
        ...logs,
        {
          ...loggerData,
          message: "Request duration",
          timestamp: Date.now(),
          loggerID,
          durationMs: Date.now() - initTime,
          status: statusCode,
        },
      ];

      finalLogs = finalLogs.map((d) => {
        const data = {
          ...d,
          ...{ loggerID, ...loggerData },
        };
        console.log(
          `Event keys count ${loggerID}===== ${Object.keys(data).length}`
        );
        return flattenObject(data);
      });

      logs = [];

      return fetch(AXIOM_INGEST_URL, {
        method: "POST",
        body: JSON.stringify(finalLogs),
        headers: {
          Authorization: `Bearer ${config.apiToken}`,
          "Content-Type": "application/json",
          "X-Axiom-Org-ID": config.orgId,
        },
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
    }

    return {
      log,
      sendLogs,
      updateLoggerData,
    };
  };
}

export function getRequestMetadata(request) {
  const { url } = request;
  const serverEndpoint = new URL(url);
  const referer = request.headers.get("referer");
  const origin = request.headers.get("origin");
  const apiEndpoint = serverEndpoint.pathname;
  return {
    requestID: request.headers.get("cf-ray") || "request-id-not-found",
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers),
    userIP: request.headers.get("x-real-ip") || "ip-not-found",
    country: request.headers.get("cf-ipcountry") || "country-not-found",
    serverEndpoint: serverEndpoint.href,
    referer,
    origin,
    apiEndpoint,
  };
}
