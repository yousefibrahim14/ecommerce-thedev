
# OIDC certificate for the EKS cluster
data "tls_certificate" "eks_oidc" {
  url = aws_eks_cluster.main.identity[0].oidc[0].issuer
}

# OIDC provider for IAM Roles for Service Accounts (IRSA)
resource "aws_iam_openid_connect_provider" "eks" {
  url = aws_eks_cluster.main.identity[0].oidc[0].issuer

  client_id_list = ["sts.amazonaws.com"]

  thumbprint_list = [
    data.tls_certificate.eks_oidc.certificates[0].sha1_fingerprint
  ]

  tags = local.common_tags
}

# Trust policy for AWS Load Balancer Controller
data "aws_iam_policy_document" "alb_controller_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.eks.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(aws_eks_cluster.main.identity[0].oidc[0].issuer, "https://", "")}:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(aws_eks_cluster.main.identity[0].oidc[0].issuer, "https://", "")}:sub"
      values   = ["system:serviceaccount:kube-system:aws-load-balancer-controller"]
    }
  }
}

# IAM role assumed by the Kubernetes service account
resource "aws_iam_role" "alb_controller" {
  name               = "${var.project_name}-alb-controller-role"
  assume_role_policy = data.aws_iam_policy_document.alb_controller_assume_role.json

  tags = local.common_tags
}

# Official AWS Load Balancer Controller permissions
resource "aws_iam_policy" "alb_controller" {
  name        = "${var.project_name}-alb-controller-policy"
  description = "Permissions for AWS Load Balancer Controller v2.14.1"
  policy      = file("${path.module}/iam_policy.json")

  tags = local.common_tags
}

# Attach permissions to the controller role
resource "aws_iam_role_policy_attachment" "alb_controller" {
  role       = aws_iam_role.alb_controller.name
  policy_arn = aws_iam_policy.alb_controller.arn
}
