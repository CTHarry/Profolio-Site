param(
  [int]$MaxWidth = 1400,
  [int]$MaxHeight = 1000,
  [int]$Quality = 80
)

Add-Type -AssemblyName System.Drawing

$photoDirectory = [System.IO.Path]::GetFullPath(
  (Join-Path $PSScriptRoot "..\Image\photos")
)
$outputDirectory = Join-Path $photoDirectory "web"

New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" }

$files = Get-ChildItem -LiteralPath $photoDirectory -File |
  Where-Object { $_.Extension -match "^\.(jpe?g|png)$" }

foreach ($file in $files) {
  $sourceImage = $null
  $previewImage = $null
  $graphics = $null
  $encoderParameters = $null

  try {
    $sourceImage = [System.Drawing.Image]::FromFile($file.FullName)

    try {
      $orientation = [int]$sourceImage.GetPropertyItem(0x0112).Value[0]
      switch ($orientation) {
        3 { $sourceImage.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
        6 { $sourceImage.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
        8 { $sourceImage.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
      }
    } catch {
      # The image has no EXIF orientation metadata.
    }

    $widthRatio = [double]$MaxWidth / [double]$sourceImage.Width
    $heightRatio = [double]$MaxHeight / [double]$sourceImage.Height
    $scale = [Math]::Min(1.0, [Math]::Min($widthRatio, $heightRatio))
    $width = [Math]::Max(1, [int][Math]::Round($sourceImage.Width * $scale))
    $height = [Math]::Max(1, [int][Math]::Round($sourceImage.Height * $scale))

    $previewImage = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($previewImage)
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.DrawImage($sourceImage, 0, 0, $width, $height)

    $encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
      [System.Drawing.Imaging.Encoder]::Quality,
      [long]$Quality
    )

    $outputPath = Join-Path $outputDirectory ($file.BaseName + ".jpg")
    $previewImage.Save($outputPath, $jpegCodec, $encoderParameters)
    Write-Output "Created $outputPath"
  } finally {
    if ($encoderParameters) { $encoderParameters.Dispose() }
    if ($graphics) { $graphics.Dispose() }
    if ($previewImage) { $previewImage.Dispose() }
    if ($sourceImage) { $sourceImage.Dispose() }
  }
}
