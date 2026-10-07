import { Config } from "remotion";

Config.setVideoImageFormat("png");
Config.setChromiumOpenGlRenderer("angle");
Config.setFrameRange([0, 300]); // 10 segundos a 30fps
