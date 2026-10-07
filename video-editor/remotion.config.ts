import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("png");
Config.setChromiumOpenGlRenderer("angle");
Config.setFrameRange([0, 510]); // 17 segundos a 30fps
Config.setChromiumExecutable("/opt/pw-browsers/chromium");
