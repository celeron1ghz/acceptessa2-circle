resource "aws_s3_bucket" "root" {
  bucket = "${local.appid}-circle-root"
  acl    = "private"
}


resource "aws_cloudfront_origin_access_identity" "root" {
  comment = "${local.appid}-circle-root"
}


resource "aws_s3_bucket_policy" "root" {
  bucket = aws_s3_bucket.root.id
  policy = data.aws_iam_policy_document.root.json
}


data "aws_iam_policy_document" "root" {
  statement {
    sid       = "1"
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.root.arn}/*"]
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.root.iam_arn]
    }
  }

  statement {
    sid       = "2"
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.root.arn]
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.root.iam_arn]
    }
  }
}
