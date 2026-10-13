pkgname=marquee-socials
pkgver=1.2.2
pkgrel=1
pkgdesc="Manage all your social media accounts in one place"
arch=(any)
url="https://github.com/omarchy-community/marquee-socials"
license=(MIT)
depends=(electron43)
package() {
  install -d "$pkgdir/usr/share/marquee-socials"
  cp -r "$startdir/src/app" "$pkgdir/usr/share/marquee-socials/app"
  install -Dm755 "$startdir/src/launcher" "$pkgdir/usr/bin/marquee-socials"
  install -Dm644 "$startdir/src/marquee-socials.desktop" "$pkgdir/usr/share/applications/marquee-socials.desktop"
  for s in 16 24 32 48 64 128 256 512; do
    install -Dm644 "$startdir/src/app/icons/${s}x${s}.png" "$pkgdir/usr/share/icons/hicolor/${s}x${s}/apps/marquee-socials.png"
  done
}
