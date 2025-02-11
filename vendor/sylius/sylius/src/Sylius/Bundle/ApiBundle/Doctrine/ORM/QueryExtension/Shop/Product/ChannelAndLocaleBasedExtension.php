<?php

/*
 * This file is part of the Sylius package.
 *
 * (c) Sylius Sp. z o.o.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Sylius\Bundle\ApiBundle\Doctrine\ORM\QueryExtension\Shop\Product;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use Sylius\Bundle\ApiBundle\SectionResolver\ShopApiSection;
use Sylius\Bundle\ApiBundle\Serializer\ContextKeys;
use Sylius\Bundle\CoreBundle\SectionResolver\SectionProviderInterface;
use Sylius\Component\Core\Model\ProductInterface;
use Webmozart\Assert\Assert;

final readonly class ChannelAndLocaleBasedExtension implements QueryCollectionExtensionInterface
{
    public function __construct(private SectionProviderInterface $sectionProvider)
    {
    }

    /**
     * @param array<array-key, mixed> $context
     */
    public function applyToCollection(
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        ?Operation $operation = null,
        array $context = [],
    ): void {
        if (!is_a($resourceClass, ProductInterface::class, true)) {
            return;
        }

        if (!$this->sectionProvider->getSection() instanceof ShopApiSection) {
            return;
        }

        Assert::keyExists($context, ContextKeys::CHANNEL);
        Assert::keyExists($context, ContextKeys::LOCALE_CODE);

        $channel = $context[ContextKeys::CHANNEL];
        $localeCode = $context[ContextKeys::LOCALE_CODE];

        $rootAlias = $queryBuilder->getRootAliases()[0];
        $localeCodeParameterName = $queryNameGenerator->generateParameterName('localeCode');
        $channelsParameterName = $queryNameGenerator->generateParameterName('channel');

        $queryBuilder
            ->addSelect('translation')
            ->innerJoin(
                sprintf('%s.translations', $rootAlias),
                'translation',
                'WITH',
                sprintf('translation.locale = :%s', $localeCodeParameterName),
            )
            ->andWhere(sprintf(':%s MEMBER OF %s.channels', $channelsParameterName, $rootAlias))
            ->setParameter($channelsParameterName, $channel)
            ->setParameter($localeCodeParameterName, $localeCode)
        ;
    }
}
