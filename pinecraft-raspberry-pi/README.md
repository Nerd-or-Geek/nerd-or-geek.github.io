
# Pinecraft on Raspberry Pi

This guide documents the YouTube video tutorial for running PyCraft (Minecraft-like) on Raspberry Pi and other platforms. PyCraft is CPU- and GPU-intensive, requiring Python 3, Pygame or ModernGL, and OpenGL acceleration.

---

## Supported Hardware
- **Raspberry Pi 4** (Recommended)
- **Raspberry Pi Zero / Zero 2** (Educational, not practical)
- **Desktop Linux / Windows** (Best experience)

---

## Installation Guide

### Common Prerequisites (All Devices)
1. **Update the system**
	```sh
	sudo apt update && sudo apt upgrade -y
	```
2. **Install Python and core tools**
	```sh
	sudo apt install -y python3 python3-pip python3-venv git
	```
3. **Verify Python version**
	```sh
	python3 --version
	```
	> You want Python 3.9+

---

### Raspberry Pi 4 (Recommended)
**OS:** Raspberry Pi OS (64-bit, Desktop preferred for GPU drivers)

1. **Enable graphics acceleration**
	```sh
	sudo raspi-config
	```
	Advanced Options → GL Driver → GL (Fake KMS)
	Reboot after setting.

2. **Install system dependencies**
	```sh
	sudo apt install -y \
	  libgl1-mesa-dev \
	  libgles2-mesa-dev \
	  libegl1-mesa-dev \
	  libsdl2-dev \
	  libjpeg-dev \
	  libfreetype6-dev
	```
3. **Create a virtual environment**
	```sh
	python3 -m venv pycraft-env
	source pycraft-env/bin/activate
	```
4. **Upgrade pip**
	```sh
	pip install --upgrade pip
	```
5. **Install PyCraft**
	```sh
	pip install pycraft
	```
	*(If the official package name differs, substitute accordingly.)*
6. **Launch PyCraft**
	```sh
	pycraft
	```

**Performance notes:**
- Use 720p resolution
- Disable shadows
- Lower render distance
- Expect ~20–30 FPS at best

---

### Raspberry Pi Zero / Zero 2
**Reality check:**
- Pi Zero (single-core): borderline unusable
- Pi Zero 2 (quad-core): may run, but poorly
- Useful mainly to demonstrate limitations

**OS:** Raspberry Pi OS Lite (no desktop)

1. **Install minimal graphics stack**
	```sh
	sudo apt install -y \
	  python3-dev \
	  libgl1-mesa-dev \
	  libsdl2-dev
	```
2. **Create virtual environment**
	```sh
	python3 -m venv pycraft-env
	source pycraft-env/bin/activate
	```
3. **Install PyCraft with minimal extras**
	```sh
	pip install pycraft --no-cache-dir
	```
4. **Launch (expect issues)**
	```sh
	pycraft --low-spec
	```

**Reality check:**
- Very long startup time
- Likely <10 FPS
- Input lag

---

### Desktop Linux
**Best experience.**

1. **Install dependencies**
	```sh
	sudo apt install -y \
	  python3 python3-pip python3-venv \
	  libgl1-mesa-dev libsdl2-dev
	```
2. **Virtual environment**
	```sh
	python3 -m venv pycraft-env
	source pycraft-env/bin/activate
	```
3. **Install PyCraft**
	```sh
	pip install pycraft
	```
4. **Run**
	```sh
	pycraft
	```

---

### Windows
**For completeness.**

1. **Install Python**
	- Download from python.org
	- Check “Add Python to PATH”
2. **Create virtual environment**
	```sh
	python -m venv pycraft-env
	pycraft-env\Scripts\activate
	```
3. **Install PyCraft**
	```sh
	pip install pycraft
	```
4. **Run**
	```sh
	pycraft
	```

---

## Troubleshooting & Common Problems

### “OpenGL not found”
- GPU driver missing
- Wrong Pi OS version
- No hardware acceleration

### Black screen on Pi
- Use Fake KMS, not Full KMS
- Lower resolution

### Crashes on launch
```sh
pip install --upgrade pygame moderngl
```

---

## Configuration
*See device-specific notes above for recommended settings.*

## Troubleshooting
*See above for common problems and fixes.*
