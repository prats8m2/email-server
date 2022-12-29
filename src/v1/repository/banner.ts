import { ClientConfig } from '../../db/entity/clientConfig.entity';
import { EntityRepository, AbstractRepository } from 'typeorm';
import { Banner } from '../../db/entity/banner.entity';

@EntityRepository(ClientConfig)
export class BannerRepository extends AbstractRepository<Banner> {
  //function to create site in the DB
  getBanner = (where: any) => {
    const result = this.manager.findOne(Banner, {
      relations: ['client'],
      order: {
        createdOn: 'DESC',
      },
      where,
    });
    return result ?? null;
  };

  //function to update site
  updateBanner = (banner: any) => {
    return this.manager.save(Banner, banner);
  };
}
