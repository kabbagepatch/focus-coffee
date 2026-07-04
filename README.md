# Focus Coffee

A simple web/desktop Coffee Pomo timer made using Tauri, with different themes and session options, and an optional task list.

## Refilling Pomo Timer
<img width="356" alt="image" src="https://github.com/user-attachments/assets/e36770ca-378f-4f97-b8c6-8bde1f9c8914" />
<img width="356" alt="image" src="https://github.com/user-attachments/assets/77c96d8e-3002-4ce2-899e-f571d290cb3a" />

## With Task List

<img width="356" alt="image" src="https://github.com/user-attachments/assets/d26d5cd9-b49f-43dc-bd9c-d36c2a61d247" />
<img width="356" alt="image" src="https://github.com/user-attachments/assets/a0f72aac-110f-4bac-b2d5-433cd9c61494" />

## Android Build
```
yarn tauri android build
cp .\src-tauri\gen\android\app\build\outputs\bundle\universalRelease\app-universal-release.aab .\
cp .\app-universal-release.aab .\bundles\app-universal-release-1006.aab
& "C:\Program Files\Android\Android Studio\jbr\bin\jarsigner.exe" -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore ..\my-release-key.jks app-universal-release.aab my-key-alias
```
