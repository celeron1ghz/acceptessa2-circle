locals {
  circle_domain = "circle.${local.apex_domain}"
}


data "aws_acm_certificate" "domain" {
  domain   = "*.${local.apex_domain}"
  provider = aws.virginia
}

data "aws_route53_zone" "domain" {
  name = local.apex_domain
}


resource "aws_cloudfront_distribution" "dist" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = local.circle_domain
  default_root_object = "index.html"
  aliases             = [local.circle_domain]

  origin {
    origin_id   = "root"
    domain_name = aws_s3_bucket.root.bucket_domain_name

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.root.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    target_origin_id       = "root"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    default_ttl            = 864000
    min_ttl                = 864000
    max_ttl                = 864000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      headers      = ["Origin"]
      cookies {
        forward = "none"
      }
    }
  }

  origin {
    origin_id   = "check"
    domain_name = local.register_endpoint

    custom_origin_config {
      http_port                = 443
      https_port               = 443
      origin_keepalive_timeout = 5
      origin_protocol_policy   = "https-only"
      origin_read_timeout      = 30
      origin_ssl_protocols     = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  ordered_cache_behavior {
    target_origin_id       = "check"
    path_pattern           = "/register/check"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      headers      = ["Origin"]
      cookies {
        forward = "all"
      }
    }
  }

  origin {
    origin_id   = "validate"
    domain_name = local.register_endpoint

    custom_origin_config {
      http_port                = 443
      https_port               = 443
      origin_keepalive_timeout = 5
      origin_protocol_policy   = "https-only"
      origin_read_timeout      = 30
      origin_ssl_protocols     = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  ordered_cache_behavior {
    target_origin_id       = "validate"
    path_pattern           = "/register/validate"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      headers      = ["Origin"]
      cookies {
        forward = "all"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.domain.arn
    ssl_support_method  = "sni-only"
  }

  custom_error_response {
    error_code         = "403"
    response_code      = "403"
    response_page_path = "/403.html"
  }

  custom_error_response {
    error_code         = "404"
    response_code      = "404"
    response_page_path = "/404.html"
  }
}

resource "aws_cloudfront_public_key" "key" {
  name        = "${local.appid}-circle"
  comment     = local.circle_domain
  encoded_key = file("../privatekey/public_key.pem")
}

resource "aws_route53_record" "record" {
  type    = "A"
  name    = local.circle_domain
  zone_id = data.aws_route53_zone.domain.id

  alias {
    name                   = aws_cloudfront_distribution.dist.domain_name
    zone_id                = "Z2FDTNDATAQYW2"
    evaluate_target_health = false
  }
}
