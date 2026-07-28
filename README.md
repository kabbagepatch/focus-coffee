# Focus Coffee

A simple web/desktop Coffee Pomo timer made using Tauri, with different themes and session options, and an optional task list.

## Refilling Pomo Timer
<img height="500" src="https://github.com/user-attachments/assets/7242fa38-5c08-44ae-a4d1-eea9a25337f2" />
<img height="500" src="https://github.com/user-attachments/assets/4ec4b62c-e3cd-46df-9602-d015f6de278e" />


<img height="500" src="https://github.com/user-attachments/assets/24858cde-0d37-47dc-b44e-7ce17d364966" />
<img height="500" src="https://github.com/user-attachments/assets/ed964f3b-4fbf-478d-84fd-0704375d460f" />


## Android Build
```
yarn tauri android build
cp .\src-tauri\gen\android\app\build\outputs\bundle\universalRelease\app-universal-release.aab .\
cp .\app-universal-release.aab .\bundles\app-universal-release-1009.aab
& "C:\Program Files\Android\Android Studio\jbr\bin\jarsigner.exe" -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore ..\my-release-key.jks app-universal-release.aab my-key-alias
```
